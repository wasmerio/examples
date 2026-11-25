---
title: "Video Embed Test"
date: 2024-06-01
categories: ["test"]
tags: ["video", "test"]
description: "Dedicated video embedding test for Bilibili and YouTube shortcodes"
---


## Bilibili Embed

{{< video bilibili="BV1GJ411x7h7" title="Bilibili Only" >}}

## YouTube Embed

{{< video youtube="dQw4w9WgXcQ" title="YouTube Only" >}}

## Dual Platform (Geo-switching)

When both Bilibili and YouTube IDs are provided, the player automatically selects the platform based on the viewer's timezone:

{{< video bilibili="BV1GJ411x7h7" youtube="dQw4w9WgXcQ" title="Auto-switch Video" >}}

## Multiple Videos on One Page

First video:

{{< video bilibili="BV1xx411c7mD" title="First Video" >}}

Second video:

{{< video youtube="jNQXAC9IVRw" title="Second Video" >}}

## Video with Surrounding Content

This paragraph appears before the video embed. The video player should integrate smoothly with surrounding text content without layout shifts.

{{< video bilibili="BV1GJ411x7h7" title="Inline Video" >}}

This paragraph appears after the video embed. Proper spacing between content and the video container is essential for good readability.

