---
title: "JS Sequence Diagrams"
date: 2015-03-04T21:57:45+08:00
draft: false

sequenceDiagrams: 
  enable: true
  options: "{theme: 'hand'}"
---


## Usage

```sequence
Andrew->China: Says Hello
Note right of China: China thinks\nabout it
China-->Andrew: How are you?
Andrew->>China: I am good thanks!
```

<!--more-->

    ```sequence
    Andrew->China: Says Hello
    Note right of China: China thinks\nabout it
    China-->Andrew: How are you?
    Andrew->>China: I am good thanks!
    ```

## Configuration

Configure for all home and regular pages:

```toml
[params.sequenceDiagrams]
  enable = true
  options = "{theme: 'hand'}"
```

Configure for a single post in the front matter (**Params in front matter have higher precedence**):

```yaml
sequenceDiagrams: 
  enable: true
  options: "{theme: 'hand'}"
```

### Options

