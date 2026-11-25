<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> — RSS Feed</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
        <style>
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

          :root{
            --bg:hsl(48,33%,98%);
            --fg:hsl(0,0%,10%);
            --card:hsl(39,23%,95%);
            --card-fg:hsl(0,0%,10%);
            --muted:hsl(36,5%,40%);
            --accent:hsl(19,82%,40%);
            --border:hsl(39,10%,85%);
          }

          @media(prefers-color-scheme:dark){
            :root{
              --bg:hsl(40,5%,6%);
              --fg:hsl(42,25%,90%);
              --card:hsl(40,5%,10%);
              --card-fg:hsl(42,25%,90%);
              --muted:hsl(40,8%,55%);
              --accent:hsl(21,88%,58%);
              --border:hsl(36,5%,20%);
            }
          }

          html{
            font-family:'Inter',system-ui,-apple-system,sans-serif;
            -webkit-font-smoothing:antialiased;
            -moz-osx-font-smoothing:grayscale;
          }

          body{
            background:var(--bg);
            color:var(--fg);
            max-width:68rem;
            margin:0 auto;
            padding:2.5rem 1.5rem;
            min-height:100vh;
          }

          /* ── Banner ── */
          .banner{
            background:var(--card);
            border:1px solid var(--border);
            border-radius:.75rem;
            padding:1.25rem 1.5rem;
            margin-bottom:2.5rem;
            display:flex;
            align-items:center;
            gap:.75rem;
          }
          .banner svg{
            flex-shrink:0;
            color:var(--accent);
          }
          .banner p{
            font-size:.875rem;
            color:var(--muted);
            line-height:1.5;
          }
          .banner a{
            color:var(--accent);
            text-decoration:underline;
            text-underline-offset:2px;
            text-decoration-color:color-mix(in srgb,var(--accent) 40%,transparent);
            transition:text-decoration-color .2s;
          }
          .banner a:hover{
            text-decoration-color:var(--accent);
          }

          /* ── Header ── */
          .feed-header{
            margin-bottom:2.5rem;
            padding-bottom:2rem;
            border-bottom:1px solid var(--border);
          }
          .feed-header h1{
            font-size:clamp(1.75rem,4vw,2.5rem);
            font-weight:700;
            letter-spacing:-.025em;
            margin-bottom:.5rem;
          }
          .feed-header .description{
            font-size:1.0625rem;
            color:var(--muted);
            line-height:1.6;
            max-width:50ch;
          }
          .feed-header .meta{
            margin-top:1rem;
            font-size:.8125rem;
            color:var(--muted);
            display:flex;
            align-items:center;
            gap:.5rem;
          }
          .feed-header .meta a{
            color:var(--accent);
            text-decoration:none;
            font-weight:500;
          }
          .feed-header .meta a:hover{
            text-decoration:underline;
          }

          /* ── Items ── */
          .feed-items h2{
            font-size:1.125rem;
            font-weight:600;
            letter-spacing:-.015em;
            color:var(--muted);
            text-transform:uppercase;
            margin-bottom:1rem;
          }
          .feed-item{
            display:block;
            text-decoration:none;
            color:inherit;
            background:var(--card);
            border:1px solid var(--border);
            border-radius:.75rem;
            padding:1.25rem 1.5rem;
            margin-bottom:.75rem;
            transition:border-color .2s,box-shadow .2s,transform .15s;
          }
          .feed-item:hover{
            border-color:var(--accent);
            box-shadow:0 0 0 1px var(--accent);
            transform:translateY(-1px);
          }
          .feed-item .item-title{
            font-size:1.125rem;
            font-weight:600;
            letter-spacing:-.015em;
            margin-bottom:.375rem;
            transition:color .2s;
          }
          .feed-item:hover .item-title{
            color:var(--accent);
          }
          .feed-item .item-date{
            font-size:.8125rem;
            color:var(--muted);
            margin-bottom:.5rem;
          }
          .feed-item .item-description{
            font-size:.9375rem;
            line-height:1.6;
            color:var(--muted);
            display:-webkit-box;
            -webkit-line-clamp:2;
            -webkit-box-orient:vertical;
            overflow:hidden;
          }

          /* ── Footer ── */
          .feed-footer{
            margin-top:3rem;
            padding-top:1.5rem;
            border-top:1px solid var(--border);
            text-align:center;
            font-size:.8125rem;
            color:var(--muted);
          }
          .feed-footer a{
            color:var(--accent);
            text-decoration:none;
            font-weight:500;
          }
          .feed-footer a:hover{
            text-decoration:underline;
          }
        </style>
      </head>
      <body>
        <div class="banner">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
          <p>
            <strong>This is an RSS feed.</strong> Subscribe by copying the URL into your reader.
            <a href="https://aboutfeeds.com">Learn more about feeds.</a>
          </p>
        </div>

        <header class="feed-header">
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="description"><xsl:value-of select="/rss/channel/description"/></p>
          <div class="meta">
            <span>·</span>
            <a>
              <xsl:attribute name="href">
                <xsl:value-of select="/rss/channel/link"/>
              </xsl:attribute>
              Visit website →
            </a>
          </div>
        </header>

        <section class="feed-items">
          <h2>Recent Posts</h2>
          <xsl:for-each select="/rss/channel/item">
            <a class="feed-item">
              <xsl:attribute name="href">
                <xsl:value-of select="link"/>
              </xsl:attribute>
              <div class="item-title"><xsl:value-of select="title"/></div>
              <div class="item-date">
                <xsl:value-of select="pubDate"/>
              </div>
              <xsl:if test="description">
                <div class="item-description"><xsl:value-of select="description"/></div>
              </xsl:if>
            </a>
          </xsl:for-each>
        </section>

        <footer class="feed-footer">
          <p>
            <xsl:value-of select="/rss/channel/title"/>
            — powered by
            <a href="https://astro.build">Astro</a>
          </p>
        </footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
