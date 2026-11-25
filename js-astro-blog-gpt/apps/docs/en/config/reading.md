# Reading UI, Sharing, and Stats

Customize which metadata items appear on posts, how many posts show up in lists, how readers share your articles, and which metrics appear on the site statistics page.

## Article Metadata Toggles (`article.display`)

Control which elements are visible on post pages via `article.display` in `blog.config.ts` (all default to `true`):

```ts
export default {
  article: {
    display: {
      title: true, // Main article H1 title
      author: true, // Author name & avatar
      published: true, // Publication date
      updated: true, // Last updated date
      readingTime: true, // Word count & estimated reading time
      tags: true, // Bottom tag pills
      share: true, // Share button bar
      navigation: true, // Previous / Next post links at the bottom
    },
  },
};
```

You can also override `display` inside an individual post's or page's frontmatter—for example, hiding `readingTime` and `navigation` on an About page.

## Post Lists and Pagination (`posts`)

Configure how posts are paginated and listed across the home view and sidebar:

| Key                     | Default                                               | Description                                                                                                  |
| ----------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `posts.perPage`         | `5`                                                   | Posts per page in the article list (`/posts/`); does not affect yearly archives or category pages.           |
| `posts.homeLimit`       | `4`                                                   | Number of recent/featured posts highlighted on the home screen.                                              |
| `posts.menuLimit`       | `12`                                                  | Number of article-title completion candidates in the input menu; the sidebar still lists all unpinned posts. |
| `posts.randomLimit`     | `12`                                                  | Number of candidate posts used when choosing a random article.                                               |
| `posts.showDraftsInDev` | `true`                                                | Show posts with `draft: true` when running `pnpm dev`.                                                       |
| `posts.dateFormat`      | `{ year: 'numeric', month: 'short', day: 'numeric' }` | `Intl.DateTimeFormatOptions` used to format post dates.                                                      |

## Social Sharing (`sharing`)

BlogGPT lets readers copy a formatted citation snippet or share directly to social platforms. You can customize the copied text template using `{title}`, `{description}`, `{author}`, `{blog}`, and `{url}` placeholders:

```ts
export default {
  sharing: {
    copyFormat: {
      zh: '《{title}》 - {author} · {blog}\n{url}',
      en: '"{title}" by {author} · {blog}\n{url}',
    },
    platforms: [
      {
        name: 'X',
        icon: 'x',
        href: 'https://x.com/intent/tweet?text={title}&url={url}',
      },
    ],
  },
};
```

## Site Statistics and Heatmap (`statistics`)

BlogGPT includes a built-in statistics overview showing total posts, total word count, writing streak/days active, language breakdown, and a GitHub-style publishing heatmap. Toggle individual metrics in `blog.config.ts`:

```ts
export default {
  statistics: {
    enabled: true,
    articleCount: true,
    wordCount: true,
    days: true,
    languages: true,
    averageWords: true,
    updateFrequency: true,
    firstPublication: true,
    lastUpdate: true,
    heatmap: true,
    recentWords: true,
    recentLimit: 12,
  },
};
```
