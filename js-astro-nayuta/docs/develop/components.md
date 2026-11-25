# Components and Pagination

[< Development guide](index.md)

Small reusable UI lives in `src/layouts/components/`; composed page UI lives in
`src/layouts/widgets/`. Sidebar widgets and MDX article components live in
`src/widgets/sidebar/` and `src/widgets/article/` respectively. See
[Architecture](architecture.md) for ownership and [Visual design](design.md)
for appearance.

## Shared UI

Use `Prose` for authored reading content, `Button` for link/action controls,
`Icon` for configured icons, and `Badge` for compact labels. The draft badge uses
`variant="draft"`. Give icon-only buttons an `ariaLabel`.

`Icon` supports image URLs, SVG URLs or trusted authored SVG markup, and font-icon
classes. Font Awesome 6.5.1 is loaded by `head-base.astro`. Inline SVGs should use
`currentColor` when they are intended to follow the surrounding text color.

`CopyrightCard` is the post-only license notice inside `Prose`, after the authored
body. It uses the site author and URL plus the post's title and effective
Creative Commons license. The post route controls visibility and
license inheritance; keep tags outside `Prose` after the card.

Reuse `Pagination` for other lists without requiring post-specific presentation.
Sidebar `Widget` supplies a section heading and optional “More” link, while
`Callout` and `TableContainer` are public imports for authored MDX.
`SearchWidget` is a native GET form containing one accessible search input. It
uses `Input` directly and has no section heading. Compose it through authored
sidebars so desktop and drawer instances follow the same resolution rules.

## Static Archives

Post and tag archives use `[...page].astro` routes with `paginateList()` from
`@assets/utils/pagination`, which adapts Astro's native `paginate()`.

| Archive   | First page    | Later pages          |
| --------- | ------------- | -------------------- |
| All posts | `/posts`      | `/posts/page/2`      |
| A tag     | `/tag/<name>` | `/tag/<name>/page/2` |

`config.postsPerPage` must be a positive integer and defaults to 10. Apply
`getPosts()` and `sortPosts()` before slicing; tag routes group sorted posts in
one pass before paginating each group. Out-of-range pages have no generated route.

Import `PostList` from `@layouts/widgets/post-list/PostList.astro`. Its default
static mode accepts `page: Page<CollectionEntry<'posts'>>` and renders only
`page.data`, including reading-time preparation. `PostListItem.astro` owns summary
markup and scoped CSS. The generated HTML and ordinary links work without
JavaScript; avoid sending the whole collection for client-side hiding.

Both list modes use the light-DOM `<nayuta-post-list>` host and shared pagination.
An empty list displays `No posts yet.`; a single-page or empty list hides the
selector. Static build cost still grows with the number of authored posts and
archive pages even though each page contains a bounded result set.

## Pagination Behavior

The pagination utilities share archive URLs (`getPageUrl`), query URLs
(`getQueryPageUrl`), bounded page numbers (`getVisiblePages`), and page normalization
(`normalizePageNumber`). Controls show at most five numbers, gaps where needed,
and available previous/next links.

`<nayuta-pagination>` owns width adaptation and dynamic selector updates. A
`ResizeObserver` measures the actual available width and hides the middle number
group if it does not fit. It rechecks after fonts load and restores numbers when
space returns. Move focus to an available previous/next link if the focused number
is hidden. Without JavaScript, links remain available and can wrap.

In dynamic mode, the selector's `setPage()` accepts a partial
`{ currentPage, lastPage, firstPageUrl }` update and recalculates width even if the
container has not resized. Connect and disconnect callbacks manage observers and
listeners for each instance. Light DOM and cloned scoped templates preserve theme
styles without framework hydration or Shadow DOM.

## Dynamic Post Lists

Use `<PostList mode="dynamic" id="search-results" pageSize={10} />` for a page
that supplies results in the browser. The default page size comes from
`config.postsPerPage`, then 10. The component handles result presentation,
pagination, loading, errors, and focus; the consuming page owns search and data
retrieval. The component does not fetch or cache the full collection.

The typed API lives in [src/types/post-list.ts](../../src/types/post-list.ts).
Wait for `customElements.whenDefined('nayuta-post-list')` before calling methods.

| Method                | Contract                                                                            |
| --------------------- | ----------------------------------------------------------------------------------- |
| `setPage(update)`     | Merge a `Partial<PostListPage>`; omitted or `undefined` fields retain their values. |
| `setLoading(loading)` | Set the loading state without replacing results.                                    |
| `setError(message?)`  | Show an error, or clear it when called without a message.                           |

`PostListPage` contains `items`, `total`, `currentPage`, and `pageSize`. Initial
values are `[]`, `0`, `1`, and the configured page size. `total` must be a
non-negative safe integer; `pageSize` must be a positive safe integer. Invalid
page numbers normalize to 1 and numbers above the known total clamp to the last
page (at least 1). Set the total before requesting later pages.

```ts
await customElements.whenDefined('nayuta-post-list');
const list = document.querySelector('nayuta-post-list');

// firstPageItems and secondPageItems are prepared by the consuming page.
list?.setPage({ items: firstPageItems, total: 42, pageSize: 10 });
list?.setPage({ currentPage: 2 }); // Request page two; retain existing items.
list?.setPage({ items: secondPageItems }); // Deliver results; retain metadata.
list?.setPage({ total: 0, items: [] }); // Explicitly clear results.
```

A page-number or page-size change without `items` dispatches a bubbling
`page-request` event with `{ currentPage, pageSize, href }` and marks retained
results `aria-busy`. Normal pagination clicks use the same method; modified clicks
retain native link behavior. An update containing `items` delivers results:
it replaces summary nodes, ends loading, clears errors, and emits no new request.
Metadata-only updates preserve item nodes; `{}` only refreshes links if the
surrounding URL changed.

Dynamic URLs use `?page=<number>` and retain other query parameters and fragments.
The search route uses `?q=<keywords>&page=<number>` and validates bounds before
delivering results; an invalid or out-of-range search page goes to `/404.html`.
The consuming page owns initial query parsing, history updates, and `popstate`.
For a new search or history navigation, deliver `items`, `total`, and `currentPage`
together to avoid request loops. Cancel or ignore stale asynchronous results.

Loading, errors, and empty states are visible; successful counts are announced
without changing the summary layout. Keyboard pagination focuses the result after
delivery. Multiple instances remain independent, and listeners are released on
disconnection and restored on reconnection. Dynamic search shells include a
no-JavaScript message and archive link so static articles remain discoverable.

## Browser Summary Data

Each `PostSummaryData` item contains `href`, `title`, `publishDate`, and
`readingTimeMinutes`, plus optional `description`, `draft`, `highlights`, and
`cover: { src, width?, height?, srcset?, sizes? }`.

Filter production drafts with `getPosts()` before publishing data. Prepare reading
time through the existing remark pipeline and local cover URLs through
`astro:assets` at build time. Dynamic summaries use text nodes for text and accept
HTTP(S) or relative URLs for links and images. Static summaries use the theme's `Image` wrapper around Astro's asset handling;
dynamic clones preserve the same image host, scoped markup, and draft badge.

### Text Highlights

Dynamic summaries accept `highlights.title` and `highlights.description`, arrays
of `{ start, end }` ranges in the corresponding plain text. Offsets count UTF-16
code units, with an inclusive start and exclusive end. Ranges must be ordered,
non-overlapping, nonempty, and within the text. Invalid ranges reject the update
before replacing existing results.

```ts
list?.setPage({
  items: [
    {
      href: '/posts/hello',
      title: 'Writing with Astro',
      publishDate: '2026-09-30',
      readingTimeMinutes: 3,
      description: 'Astro renders static pages.',
      highlights: {
        title: [{ start: 13, end: 18 }],
        description: [{ start: 0, end: 5 }],
      },
    },
  ],
  total: 1,
  currentPage: 1,
});
```

`PostList` creates text nodes and `<mark>` elements. It never treats summary text
as HTML. `PostListItem` owns the mark colors using the current palette's primary
fill and primary text tokens. Search converts Pagefind excerpts into plain text
and description ranges before calling `setPage()`; the list has no Pagefind
dependency. Static archive summaries keep their ordinary text presentation.

The tests under `tests/components/` cover page boundaries, updates, DOM
preservation, history, focus, and style parity using isolated fixtures. Chromium
setup and the broader validation checklist are in
[Contributing to Nayuta](../../CONTRIBUTING.md#checks-and-formatting).

## Images and Lightbox

Import `Image` from `@layouts/components/Image.astro` in MDX and Astro content.
`Frame` installs `ImageController` in the head and `ImageLightbox` in the body;
both layout enhancements live in `src/layouts/widgets/image/`.
The image component emits static HTML; its browser behavior is owned by the
`<nayuta-image>` custom element. `Prose` uses a `<nayuta-prose>` host to enhance
handwritten images and pictures within its own reading region.

| Prop                   | Contract                                                                                                              |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `src`                  | Public/remote URL or imported Astro `ImageMetadata`. Internal inert templates may omit it.                            |
| `alt`                  | Required text alternative; use an empty string for decorative images.                                                 |
| `width`, `height`      | Optional dimensions. Local metadata supplies omitted dimensions; supplying just one preserves the known source ratio. |
| `loading`              | `lazy` by default; use `eager` for a critical image in the first viewport.                                            |
| `ratio`                | Optional fixed CSS aspect ratio, such as `16 / 9`. Crops with `object-fit: cover` and top-center alignment.           |
| `lightbox`             | Defaults to `true`. Set `false` to exclude this image from the viewer.                                                |
| `originalSrc`          | Optional full-size image URL for the viewer. Imported assets otherwise use their original asset URL.                  |
| Other image attributes | Forwarded to the underlying `<img>`, including `class`, `style`, `srcset`, and `sizes`.                               |

Images reserve their known ratio, or 16:9 when dimensions are unavailable. Native
lazy loading schedules the request. The controller handles cached images,
`load`/`error`, and source changes; it waits for `decode()` before revealing pixels.
Successful loads replace unknown proportions with the image's natural dimensions.
A fixed `ratio` remains fixed. Failed loads retain their reserved space and show a
red crossed-circle icon with an accessible description. List templates connect
only after their image attributes have been populated.

A small head bootstrap prevents progressive pixels from flashing before the
controller loads. It releases the hidden state if the controller fails to arrive.
Without JavaScript, ordinary image markup stays visible and placeholders are
hidden. Custom elements release observers and event handlers on disconnection.

The lightbox uses PhotoSwipe 5; its core is imported on the first open. Images
within the same `Prose` are grouped, including a post's detail cover. List covers
are excluded. Each eligible image gets a native button; linked images keep their
original destination and are excluded. Use `data-lightbox="off"` on a handwritten
image or `data-image-native` to opt out of both loading and lightbox enhancement.
The latter is useful for interactive third-party content with its own controller.

PhotoSwipe's active-image append hook is delayed until decoding succeeds. It uses
the same loading pulse, decoded fade, runtime sizing, and failure symbol as page
images. Controls provide previous/next, zoom, original-image access, and closing.
`[Original]` is a button matching the other controls and opens the current image
in a new tab with `noopener,noreferrer`.
Captions use the enclosing `figcaption`, falling back to `alt`, and are inserted
as text. The viewer preserves background inert states and scroll state, contains
keyboard focus, and restores it to the opening control on close. Existing drawer
inert states are preserved. Reduced-motion preferences disable image and viewer
animations.

Browser fixtures exercise actual partial responses, build-time remote failure,
runtime dimensions, decoded reveal, lazy requests, linked/opted-out images,
source replacement, keyboard and touch navigation, error slides, focus return,
and all five palettes around both responsive breakpoints.
