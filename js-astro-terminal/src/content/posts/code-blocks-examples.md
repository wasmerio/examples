---
title: 'Code blocks examples'
description: 'The Astro Terminal theme uses Shiki as syntax highlighter, providing beautiful and customizable code highlighting.'
pubDate: 2019-03-10
author: 'Radek'
tags: []
---

The Astro Terminal theme uses Shiki as syntax highlighter, providing beautiful and customizable code highlighting with a monochrome theme that matches the terminal aesthetic.

Below you can see many basic presentations of the code blocks you can use depending on your needs.

## Examples

### Raw block with no specified language (and no syntax highlighting):

```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Example HTML5 Document</title>
  </head>
  <body>
    <p>Test</p>
  </body>
</html>
```

### With specified language:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Example HTML5 Document</title>
  </head>
  <body>
    <p>Test</p>
  </body>
</html>
```

## Programming Languages

### A

**Astro:**
```astro
---
const greeting = "Hello, World!";
---
<h1>{greeting}</h1>
```

### B

**Bash:**
```bash
echo "Hello, World!"
```


### C

**C:**
```c
#include <stdio.h>
int main() {
    printf("Hello, World!\n");
    return 0;
}
```

**C#:**
```csharp
using System;
class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}
```

**C++:**
```cpp
#include <iostream>
int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

### D

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
```

### E

**Elixir:**
```elixir
IO.puts "Hello, World!"
```

**Erlang:**
```erlang
-module(hello).
-export([world/0]).
world() -> io:format("Hello, World!~n").
```

### F

**F#:**
```fsharp
printfn "Hello, World!"
```

### G

**Go:**
```go
package main
import "fmt"
func main() {
    fmt.Println("Hello, World!")
}
```

**GraphQL:**
```graphql
type Query {
  hello: String!
}

query GetGreeting {
  hello
}
```

### H

**Haskell:**
```haskell
main = putStrLn "Hello, World!"
```

### J

**JavaScript:**
```js
var x, y, z; // Declare 3 variables
x = 5; // Assign the value 5 to x
y = 6; // Assign the value 6 to y
z = x + y; // Assign the sum of x and y to z

document.getElementById("demo").innerHTML = "The value of z is " + z + ".";
```

**JSX:**
```jsx
function Video({ video }) {
  return (
    <div>
      <Thumbnail video={video} />
      <a href={video.url}>
        <h3>{video.title}</h3>
        <p>{video.description}</p>
      </a>
      <LikeButton video={video} />
    </div>
  );
}
```

**Java:**
```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

**JSON:**
```json
{
  "message": "Hello, World!",
  "author": "Example",
  "version": 1.0
}
```

### K

**Kotlin:**
```kotlin
fun main() {
    println("Hello, World!")
}
```

### L

**Lua:**
```lua
print("Hello, World!")
```

### M

**Markdown:**
```markdown
# Hello, World!

This is a **markdown** example with:
- Lists
- **Bold** and *italic* text
- [Links](https://example.com)
```

**MATLAB:**
```matlab
disp('Hello, World!')
```

### N

**Nim:**
```nim
echo "Hello, World!"
```

### O

**Objective-C:**
```objective-c
#import <Foundation/Foundation.h>
int main() {
    @autoreleasepool {
        NSLog(@"Hello, World!");
    }
    return 0;
}
```

### P

**Perl:**
```perl
print("Hello, World!\n");
```

**PHP:**
```php
<?php echo "Hello, World!"; ?>
```

**Python:**
```python
print("Hello, World!")
```

### R

**R:**
```r
cat("Hello, World!\n")
```

**Ruby:**
```ruby
puts "Hello, World!"
```

**Rust:**
```rust
fn main() {
    println!("Hello, World!");
}
```

### S

**Scala:**
```scala
object HelloWorld extends App {
  println("Hello, World!")
}
```

**SQL:**
```sql
SELECT 'Hello, World!' AS greeting;

CREATE TABLE messages (
    id INT PRIMARY KEY,
    text VARCHAR(255)
);

INSERT INTO messages (id, text) VALUES (1, 'Hello, World!');
```

**Svelte:**
```svelte
<script>
  let greeting = 'Hello, World!';
</script>

<h1>{greeting}</h1>

<style>
  h1 {
    color: #00ff00;
  }
</style>
```

### T

**TOML:**
```toml
[package]
name = "hello-world"
version = "1.0.0"

[dependencies]
astro = "^4.0.0"
```

**TypeScript:**
```typescript
console.log("Hello, World!");
```

### V

**Vue:**
```vue
<template>
  <div>
    <h1>{{ greeting }}</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const greeting = ref('Hello, World!')
</script>
```

### Y

**YAML:**
```yaml
greeting: Hello, World!
author: Example
version: 1.0
features:
  - syntax-highlighting
  - code-blocks
  - astro-support
```

### Z

**Zig:**
```zig
const std = @import("std");
pub fn main() !void {
    std.debug.print("Hello, World!\n", .{});
}
```