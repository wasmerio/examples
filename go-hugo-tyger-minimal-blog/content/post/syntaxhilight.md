+++
title = "Syntax Hilighting Examples"
date = 2018-02-05T21:25:54+11:00
+++

[Hugo syntax hilighing documentation](https://gohugo.io/content-management/syntax-highlighting/)

*Javascript Example*

{{< highlight javascript >}}
// index.js
var arr = [1, 2, 3, 4, 5];
var b = arr.map(x => x * x);
console.log(b);
{{< /highlight >}}

*HTML example*

{{< highlight html >}}
<section id="main">
  <div>
    <h1 id="title">{{ .Title }}</h1>
    {{ range .Data.Pages }}
      {{ .Render "summary"}}
    {{ end }}
  </div>
</section>
{{< /highlight >}}
