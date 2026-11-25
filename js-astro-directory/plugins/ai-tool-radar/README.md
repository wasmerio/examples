# ai-tool-radar

A Claude Code plugin that surfaces AI tools from the Rise of Machine directory through its read-only JSON API, so Claude answers from the live catalog instead of model memory. Refer to the Rise of Machine website (https://riseofmachine.com) for the directory itself.

## Install

```
/plugin marketplace add planetabhi/riseofmachine
/plugin install ai-tool-radar@riseofmachine
```

## Commands and skills

- **`/ai-tool-radar:new [days] [category]`** lists recently added tools, grouped by category. It accepts an optional day window and category ID filter.
- **`/ai-tool-radar:find <need> [free] [open-source]`** returns the best three to five tools that match a described need, with a one-line reason for each.
- Claude loads the **`tool-discovery` skill** when you ask which AI tool to use or what tools are new, so recommendations come from the directory.

## Notes

- Data source: the `https://riseofmachine.com/api/v1` API, which is read-only.
- The directory ranks tools by recency and relevance only. It has no popularity or trending signal.
- The `tag` field holds a pricing label only. The plugin infers open-source status from a non-null `githubUrl`.

Licensed under MIT.
