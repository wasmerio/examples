import type { APIRoute } from 'astro'
import { siteConfig } from '../../site.config.mjs'
import { sitemapOptions } from '../lib/sitemap-options.mjs'

const options = sitemapOptions(siteConfig)

export const GET: APIRoute = () => !options || import.meta.env.DEV && options.devServer !== true
  ? new Response('Not Found', { status: 404 })
  : new Response(typeof options.sitemapXSLTemplate === 'string' ? options.sitemapXSLTemplate : `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
<xsl:output method="html"/><xsl:template match="/"><html><head><title>XML Sitemap</title><style>body{font:14px system-ui;margin:40px;color:#24292f}table{border-collapse:collapse;width:100%}th,td{padding:8px;border-bottom:1px solid #ddd;text-align:left}</style></head><body><h1>XML Sitemap</h1><p><xsl:value-of select="count(s:urlset/s:url)"/> URLs</p><table><tr><th>URL</th><th>Last modified</th><th>Change frequency</th></tr><xsl:for-each select="s:urlset/s:url"><tr><td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td><td><xsl:value-of select="s:lastmod"/></td><td><xsl:value-of select="s:changefreq"/></td></tr></xsl:for-each></table></body></html></xsl:template></xsl:stylesheet>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
