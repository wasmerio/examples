---
layout: ../../layouts/post.astro
title: The Long-Standing Services in My Homelab
description: A look back at a decade of self-hosting, covering the hardware, networking, media, and smart home services that earned a permanent place in my homelab.
dateFormatted: Apr 27, 2024
---

Ever since picking up my first Raspberry Pi 2B back in 2015, I have spent nearly a decade self-hosting services at home. Over the years, hardware, operating systems, and apps have come and gone, but a handful of services have stayed put in my homelab.

Here is a rundown of those permanent fixtures. I plan to update this once a year.

## Foundation

### Hardware

An Intel NUC7i3BNH bought in 2017. Still going strong 24/7, with a tentative retirement date set for 2027.

I have wanted to upgrade the hardware countless times, but my personal "cost-cutting and efficiency" doctrine stopped me every single time.

### Operating System

[openmediavault](https://www.openmediavault.org/), based on Debian.

I picked it for two reasons: a solid **Debian core** and being completely open-source.

![OMV](https://static.miantiao.me/share/2024/KepIAe/omv.png)

### Network

- Jiangsu Telecom 1000M down / 50M up EPON fiber.
- No public IPv4 (NAT444 + Full Cone NAT1 handles external access and PT seeding). Native IPv6 works normally.

![Speedtest](https://static.miantiao.me/share/2024/vdGpVz/www.speedtest.net_result_c_831700b4-25fc-46bb-8bfa-ad8831b4c0c1.png)

## Applications

### Networking

#### Clash

Handles inbound connections when I am away from home and acts as a transparent proxy gateway for LAN devices. Absolutely essential.

#### Tailscale

Connects my office and home networks. I use Clash for incoming traffic more often, but Tailscale is always there as a backup.

#### Cloudflare Tunnel

My go-to choice for exposing local services to the internet.

Connecting to Cloudflare edge nodes over HTTP/2 with IPv4 is rock-solid and easily saturates my 50 Mbps upload bandwidth.

#### Cloudflare WARP

A fallback proxy, mainly handy for ad-free video streaming.

#### Smokeping

Monitors broadband latency and packet loss. It previously helped me pinpoint performance issues on a newly installed fiber modem.

![Smokeping](https://static.miantiao.me/share/2025/Yn4wza/postspark_export_2025-03-22_21-39-33.webp)

### Smart Home

#### Home Assistant

Brings my Xiaomi smart home gear directly into Apple HomeKit.

![HomeKit](https://static.miantiao.me/share/2024/5PO1J0/k4AsIE.jpg)

#### Node-RED

Pulls data from Home Assistant and hooks into third-party APIs (currently managing my air conditioner).

![Air Conditioner](https://static.miantiao.me/share/2024/Q04elP/m8qaFB.png)

### Media

#### qBittorrent

Handles private tracker (PT) seeding. Paired with [natmap](https://github.com/heiher/natmap), it solves the seeding bottleneck without a public IPv4.

A 22 GB download easily turns into 100 GB uploaded—a 5x ratio is no trouble at all. Paired with Flood, the web UI looks great too.

![PT seeding](https://static.miantiao.me/share/2024/VtyUas/omv.home_pt_overview.png)

#### MoviePilot

Handles automated media scraping, subscriptions, and downloads from online trackers.

![MoviePilot](https://static.miantiao.me/share/2024/O5N2os/mp.jpg)

#### Jellyfin

For streaming movies and shows whenever I am outside the house.

### Services

#### TeslaMate

Logs driving history and vehicle telemetry.

![TeslaMate](https://static.miantiao.me/share/2024/WmthYj/Khpjcb.png)

#### RSSHub

Self-hosted and paired with IPv6, which solves IP-based rate limiting on many feeds.

### Storage & Files

#### Syncthing

Continuous file sync and backup between my Mac, Windows, and Linux machines.

#### AList

Aggregates multiple cloud storage drives, provides a local WebDAV server, and handles web-based file management.

#### aria2

General file downloads.

### System Management

#### Portainer

Web UI for Docker. There are plenty of newer alternatives, but this is the one my muscle memory defaults to.

#### Uptime Kuma

Deployed locally after TeslaMate once lost some data, giving me an easy way to check that everything is actually running.

![Uptime Kuma](https://static.miantiao.me/share/2025/oVpwiU/postspark_export_2025-03-22_21-39-23.webp)

![Uptime Kuma Status](https://static.miantiao.me/share/2024/cNRvt4/omv.home_8011_status_homelab.png)
