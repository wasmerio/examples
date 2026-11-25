+++
title="Blogging"
weight=16
+++

### Blog directory

Edit the `config.toml` file and change the `blogDir` key. Value will be name of the folder where the blog articles reside.

```yaml
[params]
...
blogDir = "blog"
...
```

For more info, see the [Hugo docs](https://gohugo.io/functions/where/#mainsections).

### Mobile menu positioning

The navigation menu when mobile browsing can be configured in `config.toml` to open right or left depending on preference. The "hamburger" menu icon will always display in the upper right hand corner regardless.

```yaml
[params]
...
mobileNavigation = "left" # Mobile nav menu will open to the left of the screen.
...
```

### Tags and Taxonomies

#### Show number of tags

The number of tags and taxonomies (including categories) that should be shown can be configured so that any more than this value will only be accessible when clicking the All Tags button. This is to ensure a large number of tags or categories can be easily managed without consuming excess screen real estate. Edit the `numberOfTagsShown` parameter and set accordingly.

```yaml
[params]
...
numberOfTagsShown = 14 # Applies for all other default & custom taxonomies. e.g categories, brands see https://gohugo.io/content-management/taxonomies#what-is-a-taxonomy
...
