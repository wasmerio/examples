<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [didmax-blog](https://github.com/babybluue/astro-blog) Astro theme by babybluue, copied from commit `c56983dfc8f1b498d2ac904b91356a5b563dac80` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-blog-babybluue.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with yarn, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: vercel.json.
- **Environment variables:** None.
- **Credit:** theme by [babybluue](https://github.com/babybluue), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# astro blog

![Index](/src/data/images/c3009907.png)
![Lighthouse](/lighthouse.png)

## How to create a new post with abbrlink

`generate.cjs` file will help to create a new post with params title and dir, the dir default is drafts.

```bash
 yarn run new --title='title-test' --dir="posts"
```

The command will generate a markdown file under _src/content/posts_ directory, and the markdown file content will look like this:

```yaml
---
title: title-test
date: 2024-04-18T02:50:36.418Z
abbrlink: 21cdefe2
---
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.