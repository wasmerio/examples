<?php
/**
 * Switch the demo's collection endpoints between the Free and Pro configurations.
 *
 *   wp eval-file switch-endpoint-mode.php free --user=admin
 *   wp eval-file switch-endpoint-mode.php pro  --user=admin
 *
 * RKX API Studio endpoint slugs are unique per HTTP method across namespaces, so one
 * site cannot serve both /rkx-api-studio/v1/posts (Free mode) and /rkx/v1/posts
 * (Pro mode) at the same time. This script applies wordpress/config/free-endpoints.json
 * or pro-endpoints.json to the existing "posts", "categories" and "featured" endpoints
 * through the plugin's own REST API, so normal validation applies:
 *
 *   free: default namespace rkx-api-studio/v1, Free field set (no acf: fields)
 *   pro:  custom namespace rkx/v1, Pro field set (acf: fields)
 *
 * The single-item endpoints (posts/{slug}, post-ids/{id}, categories/{slug}) stay on
 * rkx/v1 in both modes. Expects the JSON files next to this script under ../config/
 * or in /tmp/seed-data/.
 *
 * @package TheHeadlessJournal
 */

$mode = $args[0] ?? '';
if ( ! in_array( $mode, array( 'free', 'pro' ), true ) ) {
	WP_CLI::error( 'Usage: wp eval-file switch-endpoint-mode.php free|pro --user=admin' );
}
if ( ! current_user_can( 'manage_options' ) ) {
	WP_CLI::error( 'Run as an administrator: add --user=admin.' );
}

$file = null;
foreach ( array( __DIR__ . '/../config', '/tmp/seed-data' ) as $dir ) {
	if ( is_file( "$dir/$mode-endpoints.json" ) ) {
		$file = "$dir/$mode-endpoints.json";
		break;
	}
}
if ( null === $file ) {
	WP_CLI::error( "$mode-endpoints.json not found." );
}
$document = json_decode( (string) file_get_contents( $file ), true );
$wanted   = array();
foreach ( (array) ( $document['endpoints'] ?? array() ) as $entry ) {
	if ( in_array( $entry['slug'] ?? '', array( 'posts', 'categories', 'featured' ), true ) ) {
		$wanted[ $entry['slug'] ] = $entry;
	}
}

$existing = array();
foreach ( (array) get_option( 'rkx_as_endpoint_configs', array() ) as $config ) {
	if ( 'GET' === strtoupper( $config['method'] ?? 'GET' ) ) {
		$existing[ $config['slug'] ] = $config;
	}
}

/**
 * Comparable view of a configuration: only the keys this script writes.
 *
 * @param array $config Endpoint configuration (stored or requested).
 * @return string
 */
$comparable = static function ( array $config ): string {
	$keys = array( 'name', 'data_source', 'fields', 'per_page', 'offset', 'order', 'orderby', 'use_wordpress_defaults', 'description', 'taxonomy_filters', 'field_formatters', 'protected', 'namespace', 'route', 'acf_excluded_sub_fields' );
	$view = array();
	foreach ( $keys as $key ) {
		$value        = $config[ $key ] ?? null;
		$view[ $key ] = is_object( $value ) ? (array) $value : $value;
		if ( in_array( $key, array( 'taxonomy_filters', 'field_formatters', 'acf_excluded_sub_fields' ), true ) && empty( $view[ $key ] ) ) {
			$view[ $key ] = array();
		}
	}
	$view['namespace'] = (string) ( $view['namespace'] ?? '' );
	$view['route']     = (string) ( $view['route'] ?? '' );
	return wp_json_encode( $view );
};

$failures = 0;

foreach ( $wanted as $slug => $entry ) {
	if ( empty( $existing[ $slug ] ) ) {
		WP_CLI::warning( "No existing \"$slug\" endpoint; import the endpoints first." );
		++$failures;
		continue;
	}
	$id   = $existing[ $slug ]['id'];
	$body = array_diff_key( $entry, array_flip( array( 'id', 'slug', 'created_at', 'updated_at', 'allowed_keys' ) ) );
	// Pro-owned endpoint data: the namespace decides where the route is served.
	$body['namespace']               = 'pro' === $mode ? (string) ( $entry['namespace'] ?? 'rkx/v1' ) : '';
	$body['route']                   = '';
	$body['acf_excluded_sub_fields'] = 'pro' === $mode ? ( $entry['acf_excluded_sub_fields'] ?? array() ) : array();

	// Already in the requested configuration: nothing to write.
	$current = RKX_AS_Config_Controller::prepare_response( $existing[ $slug ] );
	if ( $comparable( $current ) === $comparable( $body ) ) {
		WP_CLI::log( sprintf( '%-10s already in %s configuration (unchanged)', $slug, $mode ) );
		continue;
	}

	$request = new WP_REST_Request( 'PUT', '/rkx-api-studio/v1/endpoints/' . $id );
	$request->set_param( 'id', $id );
	$request->set_header( 'X-WP-Nonce', wp_create_nonce( 'wp_rest' ) );
	$request->set_header( 'Content-Type', 'application/json' );
	$request->set_body( wp_json_encode( $body ) );
	$response = rest_do_request( $request );
	if ( $response->is_error() ) {
		WP_CLI::warning( "$slug: " . wp_json_encode( $response->get_data() ) );
		++$failures;
		continue;
	}
	$data = $response->get_data();
	WP_CLI::log( sprintf( '%-10s -> /wp-json/%s/%s (%d fields)', $slug, $data['namespace'] ?: 'rkx-api-studio/v1', $slug, count( (array) $data['fields'] ) ) );
}
if ( $failures > 0 ) {
	WP_CLI::error( "$failures endpoint(s) could not be switched to $mode mode; see the warnings above." );
}
WP_CLI::success( "Collection endpoints are in $mode mode." );
