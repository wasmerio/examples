<?php
/**
 * Reproducible WordPress Setup & Content Seeding Script for The Headless Journal
 *
 * This script runs via `wp eval-file` inside the WordPress container to:
 * 1. Delete default sample content (Hello World, Sample Page, Privacy Policy cleanup)
 * 2. Create the 3 editorial authors (Marcus Vance, Elena Rostova, David Chen)
 * 3. Create the 4 editorial categories with exact slugs & descriptions
 * 4. Create the `featured` tag and article topic tags
 * 5. Register representative ACF field group (`Editorial Article Metadata`) when ACF/SCF is active:
 *    - `article_subtitle` (text)
 *    - `hero_image` (image)
 *    - `author_info` (group: name, role, bio, avatar, github)
 *    - `related_resources` (relationship)
 * 6. Upload the 8 editorial SVG featured images to the WordPress Media Library and import
 *    the 8 articles with exact titles, slugs, manual excerpts, HTML content, publication dates,
 *    categories, tags, featured images, custom post meta, and ACF field values
 * 7. Export sanitized Free 1.0.1 configuration (`free-endpoints.json`) and, when RKX API Studio Pro
 *    is active, configure and export the Pro 1.1.0 endpoints + Dynamic Route Builder configuration
 *    (`pro-endpoints.json`) under the configured Pro custom namespace `rkx/v1` (default namespace is
 *    `rkx-api-studio/v1`).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit( "Must be run inside WordPress via WP-CLI (wp eval-file).\n" );
}

require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

// Allow SVG uploads during seeding and install permanent mu-plugin for SVG & local avatar support
$mu_plugins_dir = WP_CONTENT_DIR . '/mu-plugins';
if ( ! is_dir( $mu_plugins_dir ) ) {
	wp_mkdir_p( $mu_plugins_dir );
}
$mu_plugin_code = <<<'PHP'
<?php
/**
 * Plugin Name: RKX Headless Journal — SVG Media & Local Author Avatar Support
 * Description: Enables safe SVG rendering in the WordPress Media Library, Block Editor Featured Image panel, and ACF Image fields, and serves local author SVG avatars.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter(
	'upload_mimes',
	function ( $mimes ) {
		$mimes['svg'] = 'image/svg+xml';
		return $mimes;
	}
);

add_filter(
	'wp_check_filetype_and_ext',
	function ( $data, $file, $filename, $mimes ) {
		if ( is_string( $filename ) && str_ends_with( strtolower( $filename ), '.svg' ) ) {
			$data['ext']  = 'svg';
			$data['type'] = 'image/svg+xml';
		}
		return $data;
	},
	10,
	4
);

add_filter(
	'wp_prepare_attachment_for_js',
	function ( $response, $attachment ) {
		if ( isset( $response['mime'] ) && 'image/svg+xml' === $response['mime'] ) {
			$url               = $response['url'];
			$width             = ! empty( $response['width'] ) ? (int) $response['width'] : 1200;
			$height            = ! empty( $response['height'] ) ? (int) $response['height'] : 675;
			$response['width'] = $width;
			$response['height'] = $height;
			$response['icon']  = $url;
			$size_entry        = array(
				'url'         => $url,
				'width'       => $width,
				'height'      => $height,
				'orientation' => $width >= $height ? 'landscape' : 'portrait',
			);
			$response['sizes'] = array(
				'full'         => $size_entry,
				'thumbnail'    => $size_entry,
				'medium'       => $size_entry,
				'medium_large' => $size_entry,
				'large'        => $size_entry,
			);
		}
		return $response;
	},
	10,
	2
);

add_filter(
	'get_avatar_url',
	function ( $url, $id_or_email ) {
		$user = null;
		if ( is_numeric( $id_or_email ) ) {
			$user = get_user_by( 'id', (int) $id_or_email );
		} elseif ( is_object( $id_or_email ) && ! empty( $id_or_email->user_id ) ) {
			$user = get_user_by( 'id', (int) $id_or_email->user_id );
		} elseif ( is_string( $id_or_email ) && is_email( $id_or_email ) ) {
			$user = get_user_by( 'email', $id_or_email );
		}
		if ( $user ) {
			$uploaded_rel = get_user_meta( $user->ID, 'editorial_avatar_upload', true );
			if ( is_string( $uploaded_rel ) && '' !== $uploaded_rel ) {
				$uploads = wp_upload_dir();
				return trailingslashit( $uploads['baseurl'] ) . ltrim( $uploaded_rel, '/' );
			}
		}
		return $url;
	},
	10,
	2
);
PHP;
file_put_contents( $mu_plugins_dir . '/rkx-svg-media-support.php', $mu_plugin_code . "\n" );

add_filter(
	'upload_mimes',
	function ( $mimes ) {
		$mimes['svg'] = 'image/svg+xml';
		return $mimes;
	}
);

add_filter(
	'wp_check_filetype_and_ext',
	function ( $data, $file, $filename, $mimes ) {
		if ( str_ends_with( strtolower( $filename ), '.svg' ) ) {
			$data['ext']  = 'svg';
			$data['type'] = 'image/svg+xml';
		}
		return $data;
	},
	10,
	4
);

echo "=== 1. Cleaning up default WordPress sample content ===\n";
$default_post = get_post( 1 );
if ( $default_post && 'hello-world' === $default_post->post_name ) {
	wp_delete_post( 1, true );
	echo "Deleted default 'Hello world!' post.\n";
}
$sample_page = get_post( 2 );
if ( $sample_page && 'sample-page' === $sample_page->post_name ) {
	wp_delete_post( 2, true );
	echo "Deleted default 'Sample Page'.\n";
}
$privacy_page = get_post( 3 );
if ( $privacy_page && 'privacy-policy' === $privacy_page->post_name ) {
	wp_delete_post( 3, true );
}

// Ensure permalink structure is set to /%postname%/
update_option( 'permalink_structure', '/%postname%/' );
flush_rewrite_rules();

echo "=== 2. Creating Editorial Authors ===\n";
$authors_data = array(
	'marcus-vance'  => array(
		'user_login'   => 'marcus-vance',
		'user_email'   => 'marcus@headless-journal.local',
		'display_name' => 'Marcus Vance',
		'first_name'    => 'Marcus',
		'last_name'     => 'Vance',
		'role'         => 'editor',
		'description'  => 'Marcus leads frontend architecture initiatives with a focus on Astro, edge computing, and performant content delivery.',
		'job_role'     => 'Principal Frontend Architect',
		'avatar'       => '/images/authors/marcus.svg',
		'github'       => 'https://github.com/rkxdesign',
	),
	'elena-rostova' => array(
		'user_login'   => 'elena-rostova',
		'user_email'   => 'elena@headless-journal.local',
		'display_name' => 'Elena Rostova',
		'first_name'    => 'Elena',
		'last_name'     => 'Rostova',
		'role'         => 'editor',
		'description'  => 'Elena specializes in API contract engineering, REST scalability, and headless CMS integrations.',
		'job_role'     => 'Lead API Platform Engineer',
		'avatar'       => '/images/authors/elena.svg',
		'github'       => 'https://github.com/rkxdesign',
	),
	'david-chen'    => array(
		'user_login'   => 'david-chen',
		'user_email'   => 'david@headless-journal.local',
		'display_name' => 'David Chen',
		'first_name'    => 'David',
		'last_name'     => 'Chen',
		'role'         => 'editor',
		'description'  => 'David builds resilient publishing architectures, exploring static compilation and modern web standards.',
		'job_role'     => 'Senior Full-Stack Developer',
		'avatar'       => '/images/authors/david.svg',
		'github'       => 'https://github.com/rkxdesign',
	),
);

$author_ids  = array();
$upload_info = wp_upload_dir();
foreach ( $authors_data as $slug => $adata ) {
	$existing_user = get_user_by( 'login', $adata['user_login'] );
	if ( $existing_user ) {
		$user_id = $existing_user->ID;
		wp_update_user(
			array(
				'ID'            => $user_id,
				'display_name'  => $adata['display_name'],
				'first_name'    => $adata['first_name'],
				'last_name'     => $adata['last_name'],
				'user_nicename' => $slug,
				'description'   => $adata['description'],
			)
		);
	} else {
		$user_id = wp_insert_user(
			array(
				'user_login'    => $adata['user_login'],
				'user_pass'     => wp_generate_password( 24, true, true ),
				'user_email'    => $adata['user_email'],
				'display_name'  => $adata['display_name'],
				'first_name'    => $adata['first_name'],
				'last_name'     => $adata['last_name'],
				'user_nicename' => $slug,
				'role'          => $adata['role'],
				'description'   => $adata['description'],
			)
		);
	}
	update_user_meta( $user_id, 'editorial_role', $adata['job_role'] );
	update_user_meta( $user_id, 'editorial_avatar', $adata['avatar'] );

	// Copy author SVG avatar into WordPress uploads so get_avatar_url() serves a local SVG
	$author_svg_basename = 'author-' . basename( $adata['avatar'] );
	$author_svg_source   = '/tmp/seed-data/' . $author_svg_basename;
	if ( file_exists( $author_svg_source ) ) {
		$author_svg_target = $upload_info['path'] . '/' . $author_svg_basename;
		copy( $author_svg_source, $author_svg_target );
		$rel_author_upload = ltrim( $upload_info['subdir'] . '/' . $author_svg_basename, '/' );
		update_user_meta( $user_id, 'editorial_avatar_upload', $rel_author_upload );
	}

	$author_ids[ $adata['display_name'] ] = $user_id;
	echo "Author ready: {$adata['display_name']} (ID: {$user_id})\n";
}

echo "=== 3. Creating Editorial Categories ===\n";
$categories_json_path = '/tmp/seed-data/categories.json';
$categories_raw       = json_decode( file_get_contents( $categories_json_path ), true );
$category_ids         = array();

// Rename default category 1 (Uncategorized) to the first editorial category so we don't have an extra Uncategorized category in /categories
$first_cat = $categories_raw[0];
wp_update_term(
	1,
	'category',
	array(
		'name'        => $first_cat['name'],
		'slug'        => $first_cat['slug'],
		'description' => $first_cat['description'],
	)
);
$category_ids[ $first_cat['slug'] ] = 1;
echo "Category ready (updated default ID 1): {$first_cat['name']} (slug: {$first_cat['slug']}, ID: 1)\n";

for ( $i = 1; $i < count( $categories_raw ); $i++ ) {
	$cat      = $categories_raw[ $i ];
	$existing = get_term_by( 'slug', $cat['slug'], 'category' );
	if ( $existing ) {
		wp_update_term(
			$existing->term_id,
			'category',
			array(
				'name'        => $cat['name'],
				'slug'        => $cat['slug'],
				'description' => $cat['description'],
			)
		);
		$term_id = (int) $existing->term_id;
	} else {
		$inserted = wp_insert_term(
			$cat['name'],
			'category',
			array(
				'slug'        => $cat['slug'],
				'description' => $cat['description'],
			)
		);
		$term_id  = (int) $inserted['term_id'];
	}
	$category_ids[ $cat['slug'] ] = $term_id;
	echo "Category ready: {$cat['name']} (slug: {$cat['slug']}, ID: {$term_id})\n";
}

echo "=== 4. Creating 'featured' Tag ===\n";
$featured_tag = get_term_by( 'slug', 'featured', 'post_tag' );
if ( ! $featured_tag ) {
	$inserted_tag    = wp_insert_term(
		'featured',
		'post_tag',
		array(
			'slug'        => 'featured',
			'description' => 'Lead editorial story featured on the homepage.',
		)
	);
	$featured_tag_id = (int) $inserted_tag['term_id'];
} else {
	$featured_tag_id = (int) $featured_tag->term_id;
}
echo "Featured tag ready (slug: featured, ID: {$featured_tag_id})\n";

echo "=== 5. Registering Representative ACF Field Group (if ACF is active) ===\n";
$has_acf = function_exists( 'acf_import_field_group' ) && function_exists( 'update_field' );
if ( $has_acf ) {
	$existing_group = acf_get_field_group( 'group_rkx_editorial_metadata' );
	$acf_group_def  = array(
		'key'      => 'group_rkx_editorial_metadata',
		'title'    => 'Editorial Article Metadata',
		'fields'   => array(
			array(
				'key'   => 'field_rkx_article_subtitle',
				'label' => 'Article Subtitle',
				'name'  => 'article_subtitle',
				'type'  => 'text',
			),
			array(
				'key'           => 'field_rkx_hero_image',
				'label'         => 'Hero Image',
				'name'          => 'hero_image',
				'type'          => 'image',
				'return_format' => 'array',
			),
			array(
				'key'        => 'field_rkx_author_info',
				'label'      => 'Author Information',
				'name'       => 'author_info',
				'type'       => 'group',
				'layout'     => 'block',
				'sub_fields' => array(
					array(
						'key'   => 'field_rkx_author_name',
						'label' => 'Author Name',
						'name'  => 'name',
						'type'  => 'text',
					),
					array(
						'key'   => 'field_rkx_author_role',
						'label' => 'Author Role',
						'name'  => 'role',
						'type'  => 'text',
					),
					array(
						'key'   => 'field_rkx_author_bio',
						'label' => 'Author Bio',
						'name'  => 'bio',
						'type'  => 'textarea',
					),
					array(
						'key'   => 'field_rkx_author_avatar',
						'label' => 'Author Avatar',
						'name'  => 'avatar',
						'type'  => 'text',
					),
					array(
						'key'   => 'field_rkx_author_github',
						'label' => 'Author GitHub',
						'name'  => 'github',
						'type'  => 'url',
					),
				),
			),
			array(
				'key'           => 'field_rkx_related_resources',
				'label'         => 'Related Resources',
				'name'          => 'related_resources',
				'type'          => 'relationship',
				'post_type'     => array( 'post' ),
				'return_format' => 'object',
			),
		),
		'location' => array(
			array(
				array(
					'param'    => 'post_type',
					'operator' => '==',
					'value'    => 'post',
				),
			),
		),
		'active'   => true,
	);
	if ( $existing_group && ! empty( $existing_group['ID'] ) ) {
		$acf_group_def['ID'] = $existing_group['ID'];
	}
	acf_import_field_group( $acf_group_def );
	echo "ACF field group 'Editorial Article Metadata' registered.\n";
} else {
	echo "ACF not active; skipping ACF field group registration.\n";
}

echo "=== 6. Importing 8 Demo Articles, Featured Images & ACF Metadata ===\n";
$posts_json_path  = '/tmp/seed-data/posts.json';
$posts_raw        = json_decode( file_get_contents( $posts_json_path ), true );
$upload_dir       = wp_upload_dir();
$post_ids_by_slug = array();
$attach_by_slug   = array();

foreach ( $posts_raw as $article ) {
	$slug        = $article['slug'];
	$author_name = $article['author']['name'];
	$author_id   = $author_ids[ $author_name ] ?? 1;
	$cat_slug    = $article['category']['slug'];
	$cat_id      = $category_ids[ $cat_slug ] ?? 1;

	// Convert ISO 8601 UTC date (e.g. 2026-10-18T09:00:00Z) to WordPress Y-m-d H:i:s
	$timestamp = strtotime( $article['publishedAt'] );
	$post_date = gmdate( 'Y-m-d H:i:s', $timestamp );

	// Check if post already exists
	$existing_posts = get_posts(
		array(
			'name'        => $slug,
			'post_type'   => 'post',
			'post_status' => 'any',
			'numberposts' => 1,
		)
	);

	$post_args = array(
		'post_title'    => $article['title'],
		'post_name'     => $slug,
		'post_excerpt'  => $article['excerpt'],
		'post_content'  => $article['content'],
		'post_status'   => 'publish',
		'post_type'     => 'post',
		'post_author'   => $author_id,
		'post_date'     => $post_date,
		'post_date_gmt' => $post_date,
		'post_category' => array( $cat_id ),
	);

	if ( ! empty( $existing_posts ) ) {
		$post_args['ID'] = $existing_posts[0]->ID;
		$post_id         = wp_update_post( $post_args );
	} else {
		$post_id = wp_insert_post( $post_args );
	}

	$post_ids_by_slug[ $slug ] = (int) $post_id;

	// Assign tags (including 'featured' tag if article is featured)
	$tag_names = $article['tags'] ?? array();
	if ( ! empty( $article['featured'] ) ) {
		$tag_names[] = 'featured';
	}
	wp_set_post_terms( $post_id, $tag_names, 'post_tag', false );

	// Store unprotected custom post meta for Free Mode compatibility
	update_post_meta( $post_id, 'subtitle', $article['subtitle'] ?? '' );
	update_post_meta( $post_id, 'reading_time', (string) ( $article['readingTime'] ?? 5 ) );
	update_post_meta( $post_id, 'featured_image_alt', $article['featuredImageAlt'] ?? $article['title'] );
	update_post_meta( $post_id, 'author_role', $article['author']['role'] ?? '' );
	update_post_meta( $post_id, 'author_bio', $article['author']['bio'] ?? '' );
	update_post_meta( $post_id, 'author_avatar', $article['author']['avatar'] ?? '' );

	// Import featured image into WordPress Media Library
	$rel_image_path = ltrim( $article['featuredImage'], '/' ); // e.g., images/articles/headless-architecture.svg
	$source_file    = '/tmp/seed-data/' . basename( $rel_image_path );

	if ( file_exists( $source_file ) ) {
		$filename    = basename( $source_file );
		$target_path = $upload_dir['path'] . '/' . $filename;
		copy( $source_file, $target_path );

		$existing_thumb_id = (int) get_post_thumbnail_id( $post_id );
		if ( ! $existing_thumb_id ) {
			$attachment = array(
				'guid'           => $upload_dir['url'] . '/' . $filename,
				'post_mime_type' => 'image/svg+xml',
				'post_title'     => $article['featuredImageAlt'] ?? $article['title'],
				'post_content'   => '',
				'post_status'    => 'inherit',
			);
			$attach_id  = (int) wp_insert_attachment( $attachment, $target_path, $post_id );
			set_post_thumbnail( $post_id, $attach_id );
		} else {
			$attach_id = $existing_thumb_id;
		}

		update_post_meta( $attach_id, '_wp_attachment_image_alt', $article['featuredImageAlt'] ?? $article['title'] );
		$svg_filesize = (int) filesize( $target_path );
		$svg_subsize  = array(
			'file'      => $filename,
			'width'     => 1200,
			'height'    => 675,
			'mime-type' => 'image/svg+xml',
			'filesize'  => $svg_filesize,
		);
		wp_update_attachment_metadata(
			$attach_id,
			array(
				'width'    => 1200,
				'height'   => 675,
				'file'     => ltrim( $upload_dir['subdir'] . '/' . $filename, '/' ),
				'filesize' => $svg_filesize,
				'sizes'    => array(
					'thumbnail'    => $svg_subsize,
					'medium'       => $svg_subsize,
					'medium_large' => $svg_subsize,
					'large'        => $svg_subsize,
					'1536x1536'    => $svg_subsize,
					'2048x2048'    => $svg_subsize,
				),
			)
		);
		$attach_by_slug[ $slug ] = $attach_id;
	}

	echo "Imported article: {$article['title']} (ID: {$post_id}, slug: {$slug})\n";
}

// Populate ACF fields on all 8 articles now that all post IDs and attachments exist
if ( $has_acf ) {
	foreach ( $posts_raw as $article ) {
		$slug    = $article['slug'];
		$post_id = $post_ids_by_slug[ $slug ];
		$cat_slug = $article['category']['slug'];

		// Related resources: same-category posts first, then recent posts (up to 2)
		$same_cat_ids = array();
		$other_ids    = array();
		foreach ( $posts_raw as $candidate ) {
			if ( $candidate['slug'] === $slug ) {
				continue;
			}
			$cid = $post_ids_by_slug[ $candidate['slug'] ];
			if ( $candidate['category']['slug'] === $cat_slug ) {
				$same_cat_ids[] = $cid;
			} else {
				$other_ids[] = $cid;
			}
		}
		$related_ids = array_slice( array_merge( $same_cat_ids, $other_ids ), 0, 2 );

		update_field( 'field_rkx_article_subtitle', $article['subtitle'] ?? '', $post_id );
		if ( ! empty( $attach_by_slug[ $slug ] ) ) {
			update_field( 'field_rkx_hero_image', $attach_by_slug[ $slug ], $post_id );
		}
		update_field(
			'field_rkx_author_info',
			array(
				'name'   => $article['author']['name'] ?? '',
				'role'   => $article['author']['role'] ?? '',
				'bio'    => $article['author']['bio'] ?? '',
				'avatar' => $article['author']['avatar'] ?? '',
				'github' => 'https://github.com/rkxdesign',
			),
			$post_id
		);
		update_field( 'field_rkx_related_resources', $related_ids, $post_id );
	}
	echo "Populated ACF fields (article_subtitle, hero_image, author_info, related_resources) for all 8 articles.\n";
}

// Recalculate term counts
wp_update_term_count_now( array_values( $category_ids ), 'category' );

echo "=== 7. Configuring RKX API Studio Endpoints (Free & Pro) ===\n";
$now_iso = '2026-11-07T10:30:00Z';

$free_post_fields = array(
	'id',
	'slug',
	'title',
	'excerpt',
	'content',
	'date',
	'featured_image_url',
	'author',
	'taxonomy:category',
	'taxonomy:post_tag',
	'meta:subtitle',
	'meta:reading_time',
	'meta:featured_image_alt',
	'meta:author_role',
	'meta:author_bio',
	'meta:author_avatar',
);

$free_endpoints_config = array(
	'endpoint_posts'      => array(
		'id'                     => 'endpoint_posts',
		'name'                   => 'Posts',
		'slug'                   => 'posts',
		'method'                 => 'GET',
		'description'            => 'Paginated blog articles with categories, tags, author details, featured image URL, and editorial metadata.',
		'data_source'            => 'posts',
		'custom_taxonomy'        => '',
		'fields'                 => $free_post_fields,
		'field_formatters'       => array(),
		'per_page'               => 4,
		'offset'                 => 0,
		'order'                  => 'DESC',
		'orderby'                => 'date',
		'use_wordpress_defaults' => false,
		'taxonomy_filters'       => array(),
		'protected'              => false,
		'auth_scheme'            => 'key',
		'created_at'             => $now_iso,
		'updated_at'             => $now_iso,
	),
	'endpoint_categories' => array(
		'id'                     => 'endpoint_categories',
		'name'                   => 'Categories',
		'slug'                   => 'categories',
		'method'                 => 'GET',
		'description'            => 'Editorial categories with term ID, slug, name, description, and published post count.',
		'data_source'            => 'categories',
		'custom_taxonomy'        => '',
		'fields'                 => array(
			'id',
			'slug',
			'name',
			'description',
			'count',
		),
		'field_formatters'       => array(),
		'per_page'               => 20,
		'offset'                 => 0,
		'order'                  => 'ASC',
		'orderby'                => 'id',
		'use_wordpress_defaults' => false,
		'taxonomy_filters'       => array(),
		'protected'              => false,
		'auth_scheme'            => 'key',
		'created_at'             => $now_iso,
		'updated_at'             => $now_iso,
	),
	'endpoint_featured'   => array(
		'id'                     => 'endpoint_featured',
		'name'                   => 'Featured Posts',
		'slug'                   => 'featured',
		'method'                 => 'GET',
		'description'            => 'Featured lead articles filtered by the WordPress "featured" post_tag (site-specific term_id: ' . $featured_tag_id . ').',
		'data_source'            => 'posts',
		'custom_taxonomy'        => '',
		'fields'                 => $free_post_fields,
		'field_formatters'       => array(),
		'per_page'               => 1,
		'offset'                 => 0,
		'order'                  => 'DESC',
		'orderby'                => 'date',
		'use_wordpress_defaults' => false,
		'taxonomy_filters'       => array(
			'post_tag' => array( $featured_tag_id ),
		),
		'protected'              => false,
		'auth_scheme'            => 'key',
		'created_at'             => $now_iso,
		'updated_at'             => $now_iso,
	),
);

// Export Free configuration (`free-endpoints.json`)
$export_free_endpoints = array();
foreach ( array_values( $free_endpoints_config ) as $ep ) {
	$export_free_endpoints[] = array(
		'id'                     => $ep['id'],
		'name'                   => $ep['name'],
		'slug'                   => $ep['slug'],
		'method'                 => $ep['method'],
		'data_source'            => $ep['data_source'],
		'fields'                 => $ep['fields'],
		'per_page'               => $ep['per_page'],
		'offset'                 => $ep['offset'],
		'order'                  => $ep['order'],
		'orderby'                => $ep['orderby'],
		'use_wordpress_defaults' => false,
		'description'            => $ep['description'],
		'taxonomy_filters'       => ! empty( $ep['taxonomy_filters'] ) ? $ep['taxonomy_filters'] : new stdClass(),
		'field_formatters'       => new stdClass(),
		'protected'              => false,
		'created_at'             => $ep['created_at'],
		'updated_at'             => $ep['updated_at'],
	);
}

$free_export_document = array(
	'version'   => 1,
	'settings'  => array(
		'cache_enabled' => false,
		'cache_ttl'     => 300,
	),
	'endpoints' => $export_free_endpoints,
);

file_put_contents(
	'/tmp/seed-data/free-endpoints.json',
	json_encode( $free_export_document, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ) . "\n"
);

$is_pro_active = function_exists( 'rkx_as_pro_is_active' ) && rkx_as_pro_is_active();
$controller    = new RKX_AS_Config_Controller();

if ( $is_pro_active ) {
	echo "RKX API Studio Pro is active — configuring custom namespace rkx/v1, ACF mappings, and Dynamic Route Builder endpoints...\n";

	// Register custom namespace rkx/v1
	update_option( RKX_AS_Api_Namespaces::OPTION_KEY, array( 'rkx/v1' ) );

	$pro_post_fields = array_merge(
		$free_post_fields,
		$has_acf
			? array(
				'acf:article_subtitle',
				'acf:hero_image',
				'acf:author_info',
				'acf:related_resources',
			)
			: array()
	);

	$pro_dynamic_post_fields = array_merge(
		$pro_post_fields,
		array( RKX_AS_Pro_Dynamic_Routes::MARKER_FIELD )
	);

	$pro_endpoints_raw = array(
		'endpoint_posts'           => array_merge(
			$free_endpoints_config['endpoint_posts'],
			array(
				'description' => 'Paginated blog articles with categories, tags, author details, featured image URL, post meta, and typed ACF fields.',
				'fields'      => $pro_post_fields,
				'namespace'   => 'rkx/v1',
				'route'       => '',
			)
		),
		'endpoint_categories'      => array_merge(
			$free_endpoints_config['endpoint_categories'],
			array(
				'namespace' => 'rkx/v1',
				'route'     => '',
			)
		),
		'endpoint_featured'        => array_merge(
			$free_endpoints_config['endpoint_featured'],
			array(
				'fields'    => $pro_post_fields,
				'namespace' => 'rkx/v1',
				'route'     => '',
			)
		),
		'endpoint_post_detail'     => array(
			'id'                     => 'endpoint_post_detail',
			'name'                   => 'Single Post by Slug',
			'slug'                   => 'post-detail',
			'route'                  => 'posts/{slug}',
			'namespace'              => 'rkx/v1',
			'method'                 => 'GET',
			'description'            => 'Single article detail resolved by URL slug via Dynamic Route Builder, including full HTML content and typed ACF fields.',
			'data_source'            => 'posts',
			'custom_taxonomy'        => '',
			'fields'                 => $pro_dynamic_post_fields,
			'field_formatters'       => array(),
			'per_page'               => 1,
			'offset'                 => 0,
			'order'                  => 'DESC',
			'orderby'                => 'date',
			'use_wordpress_defaults' => false,
			'taxonomy_filters'       => array(),
			'protected'              => false,
			'auth_scheme'            => 'key',
			'created_at'             => $now_iso,
			'updated_at'             => $now_iso,
		),
		'endpoint_post_by_id'      => array(
			'id'                     => 'endpoint_post_by_id',
			'name'                   => 'Single Post by ID',
			'slug'                   => 'post-by-id',
			'route'                  => 'post-ids/{id}',
			'namespace'              => 'rkx/v1',
			'method'                 => 'GET',
			'description'            => 'Single article detail resolved by numeric WordPress post ID via Dynamic Route Builder.',
			'data_source'            => 'posts',
			'custom_taxonomy'        => '',
			'fields'                 => $pro_dynamic_post_fields,
			'field_formatters'       => array(),
			'per_page'               => 1,
			'offset'                 => 0,
			'order'                  => 'DESC',
			'orderby'                => 'date',
			'use_wordpress_defaults' => false,
			'taxonomy_filters'       => array(),
			'protected'              => false,
			'auth_scheme'            => 'key',
			'created_at'             => $now_iso,
			'updated_at'             => $now_iso,
		),
		'endpoint_category_detail' => array(
			'id'                     => 'endpoint_category_detail',
			'name'                   => 'Single Category by Slug',
			'slug'                   => 'category-detail',
			'route'                  => 'categories/{slug}',
			'namespace'              => 'rkx/v1',
			'method'                 => 'GET',
			'description'            => 'Single editorial category resolved by URL slug via Dynamic Route Builder.',
			'data_source'            => 'categories',
			'custom_taxonomy'        => '',
			'fields'                 => array(
				'id',
				'slug',
				'name',
				'description',
				'count',
				RKX_AS_Pro_Dynamic_Routes::MARKER_FIELD,
			),
			'field_formatters'       => array(),
			'per_page'               => 1,
			'offset'                 => 0,
			'order'                  => 'ASC',
			'orderby'                => 'name',
			'use_wordpress_defaults' => false,
			'taxonomy_filters'       => array(),
			'protected'              => false,
			'auth_scheme'            => 'key',
			'created_at'             => $now_iso,
			'updated_at'             => $now_iso,
		),
	);

	// Reset options before sequential validation so dynamic route collision checks run cleanly
	update_option( RKX_AS_OPTION_KEY, array() );
	update_option( RKX_AS_Pro_Endpoint_Data::OPTION_KEY, array() );

	$validated_configs = array();

	foreach ( $pro_endpoints_raw as $id => $cfg ) {
		$sanitized  = apply_filters( 'rkx_as_prepare_endpoint', $controller->sanitize_config( $cfg ), $cfg, array() );
		$validation = $controller->validate_config( $sanitized, $cfg );
		if ( is_wp_error( $validation ) ) {
			echo "ERROR validating Pro endpoint {$id}: " . $validation->get_error_message() . "\n";
			print_r( $validation->get_error_data() );
			exit( 1 );
		}
		$validated_configs[ $id ] = $sanitized;
		update_option( RKX_AS_OPTION_KEY, $validated_configs );
		do_action( 'rkx_as_endpoint_saved', $sanitized, $cfg );
		$route_display = ! empty( $cfg['route'] ) ? $cfg['route'] : $sanitized['slug'];
		echo "Configured and validated Pro endpoint: /wp-json/rkx/v1/{$route_display}\n";
	}

	// Enable transient caching in settings so cache behavior (MISS -> HIT) is active and verifiable
	$settings = RKX_AS_Settings_Controller::sanitize_settings(
		array(
			'delete_data_on_uninstall' => false,
			'cache_enabled'            => true,
			'cache_ttl'                => 300,
		)
	);
	update_option( RKX_AS_Settings_Controller::OPTION_KEY, $settings );

	( new RKX_AS_Cache_Manager() )->clear_all();

	// Generate official Pro export document (`pro-endpoints.json`)
	$export_pro_endpoints = array();
	foreach ( array_values( $validated_configs ) as $ep ) {
		$prepared = RKX_AS_Config_Controller::prepare_response( $ep );
		$item     = array(
			'id'                      => $prepared['id'],
			'name'                    => $prepared['name'],
			'slug'                    => $prepared['slug'],
			'method'                  => $prepared['method'] ?? 'GET',
			'data_source'             => $prepared['data_source'],
			'fields'                  => $prepared['fields'],
			'per_page'                => $prepared['per_page'],
			'offset'                  => $prepared['offset'],
			'order'                   => $prepared['order'],
			'orderby'                 => $prepared['orderby'],
			'use_wordpress_defaults'  => (bool) ( $prepared['use_wordpress_defaults'] ?? false ),
			'description'             => $prepared['description'] ?? '',
			'taxonomy_filters'        => ! empty( $prepared['taxonomy_filters'] ) ? $prepared['taxonomy_filters'] : new stdClass(),
			'field_formatters'        => ! empty( $prepared['field_formatters'] ) ? $prepared['field_formatters'] : new stdClass(),
			'protected'               => (bool) ( $prepared['protected'] ?? false ),
			'namespace'               => $prepared['namespace'] ?? '',
			'route'                   => $prepared['route'] ?? '',
			'allowed_keys'            => $prepared['allowed_keys'] ?? array(),
			'acf_excluded_sub_fields' => ! empty( $prepared['acf_excluded_sub_fields'] ) ? $prepared['acf_excluded_sub_fields'] : new stdClass(),
			'created_at'              => $prepared['created_at'] ?? '',
			'updated_at'              => $prepared['updated_at'] ?? '',
		);
		$export_pro_endpoints[] = $item;
	}

	$pro_export_document = array(
		'version'   => 1,
		'settings'  => array(
			'cache_enabled' => $settings['cache_enabled'],
			'cache_ttl'     => $settings['cache_ttl'],
		),
		'endpoints' => $export_pro_endpoints,
	);

	file_put_contents(
		'/tmp/seed-data/pro-endpoints.json',
		json_encode( $pro_export_document, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ) . "\n"
	);
} else {
	$validated_configs = array();
	foreach ( $free_endpoints_config as $id => $cfg ) {
		$sanitized  = $controller->sanitize_config( $cfg );
		$validation = $controller->validate_config( $sanitized, $cfg );
		if ( is_wp_error( $validation ) ) {
			echo "ERROR validating Free endpoint {$id}: " . $validation->get_error_message() . "\n";
			exit( 1 );
		}
		$validated_configs[ $id ] = $sanitized;
	}
	update_option( RKX_AS_OPTION_KEY, $validated_configs );
	$settings = RKX_AS_Settings_Controller::sanitize_settings(
		array(
			'delete_data_on_uninstall' => false,
			'cache_enabled'            => false,
			'cache_ttl'                => 300,
		)
	);
	update_option( RKX_AS_Settings_Controller::OPTION_KEY, $settings );
	( new RKX_AS_Cache_Manager() )->clear_all();
}

echo "=== Seeding & Endpoint Export Complete! ===\n";
