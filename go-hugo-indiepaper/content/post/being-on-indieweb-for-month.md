---
title: "What I Have Learned Being on the IndieWeb for a Month"
date: 2026-01-14T00:00:00-07:00
draft: false
summary: "A month of building, connecting, and discovering the independent web. Small technical joys that turned solitude into dialogue. Treat the Internet like a personal playground and lab!"
tags: ["personal-essay", "community", "digital-culture", "indieweb", "technical"]
categories: ["journal"]
description: "A month of building, connecting, and discovering the independent web. Small technical joys that turned solitude into dialogue. Treat the Internet like a personal playground and lab!"
image: "/assets/images/blog/village.jpg"
---


Around a month ago, after discovering [omg.lol](https://omg.lol) and writing [an article](https://blog.brennanbrown.ca/omg-lol-is-the-internet-we-need-right-now-3538199d5dea) on it (which turned out to be one of my most popular, ever). I decided I finally needed to get serious about my own contributions to the IndieWeb. Sure, I've have [a portfolio](https://brennanbrown.ca) for years, but so what? This is performative and designed for recruiters and potential future employers.

No, I needed something entirely different, entirely just for me. to buy a new domain on [PorkBun](https://porkbun.com/), sign up on [GitLab](https://gitlab,.com) to build a [new site from scratch](https://gitlab.com/brennankbrown/brennan.day) with a [design that sparked joy](https://brennan.day/building-brennan-day-part-one-design-rainbows-and-accessibility/) for me, and finally sink my teeth and immerse myself into the independent Internet.

There are so many things that I could list off that have been positive in this experience so far. Creating all the different [slash pages](https://slashpages.net/) for my site made me do an inventory of myself: what matters? what do I care about? What do I use on a daily basis that I ought to be grateful for? You can see all my different pages [here](https://brennan.day/slash-pages/).

These are not the kind of introspective questions you find yourself asking on a consistent basis on typical social media platforms (Instagram, TikTok, or God forbid X). There's just an overwhelming amount of content, of new information and stimuli to ever just meditate.

I found myself no longer merely writing navel-gazing articles and thinkpieces, I was actively trying to figure out how to improve my site for others and, in turn, share those improvements for others to copy. Because my site is entirely free and open source, meaning that anybody can outright take any code or ideas I share. And I encourage it!

I'd like to go over a few pieces of tech that I have been developing on my site since I began (warning: ultra-nerdy talk ahead):

* To start, I used [IndieAuth](https://indieauth.com/) to add [**a comment section**](https://brennan.day/building-an-indieauth-comment-system-for-your-static-site/) to my blog posts. This means that other people can respond without needing to make yet another account and remember yet another password. All you need is your own website, which you really ought to have! This turned my website from a guy talking to himself into a proper dialogue, a to-and-fro.
* I can [**write posts anywhere online**](https://brennan.day/posting-to-your-static-site-with-quill-and-micropub/) using the same code that I used to add a comment section, I also turned my website into an API that allows me to publish blog posts from [Quill](https://quill.p3k.io/) with Micropub.
* I got into the weeds and [**improved optimization,**](https://brennan.day/from-65-to-83-attempts-at-performance-optimization/) figuring out how to implement good coding practices to make my site load faster. For instance, my massive from-scratch CSS stylesheet was split up into fourteen different parts, with each part hashed so that the unchanged parts remain cached in people's browsers.
* I extended the functionality of Robb Knight's [**post graph plugin**](https://brennan.day/extending-the-post-graph-plugin-adding-clickable-links-and-tooltips/), which allows me to have a cool visualization of my posts on my homepage that's now fully interactable.
* I found out about [the history of **88x31 badges**](https://88x31.nl/history.html), and discovered over a dozen badges that I'm totally in love with to display on my own site, and also found [a really awesome generator](https://ritual.sh/resources/button-generator/) to create my own!
* To connect with others on the IndieWeb, I searched and added myself to [**web rings**](https://anjackson.net/2022/12/17/revisiting-web-rings/), which are ways of connecting sites and adding social discoverability to your site without search engines.
    - My site is now part of the [XXIIVV Webring](https://webring.xxiivv.com/#brennan), [Bucketfish Webring](https://webring.bucketfish.me/), [Hotline Webring](https://hotlinewebring.club/), [Static.Quest Webring](https://static.quest/), [Dinhe.net Webring](https://webring.dinhe.net/), the [Fediring](https://fediring.net/) and of course, the [IndieWeb Webring](https://xn--sr8hvo.ws/).
* I used [**GitLab's CI/CD**](https://brennan.day/deploying-an-eleventy-site-to-neocities-with-gitlab-ci-cd/) to mirror my site to [NeoCities](https://brennanday.neocities.org), giving me both a redundant backup of my site, but also allowing my site to live within NeoCities' ecosystem rather effortlessly.
* I created a [**gratitude log**](https://brennan.day/auld-lang-syne-the-commonplace-micro-log/) that lives at [log.brennan.day](https://log.brennan.day). This is particularly interesting because this subdomain is a site that lives in a separate repository that I'm [tracking with Beeminder](https://beeminder.com/brennanbrown/gratitude). This means I need to update the site with my daily gratitude journal each day or else I have to pay! Talk about accountability and pushing myself to do what I know I ought to be doing.
* I discovered even [**more resources**](https://brennan.day/resources-for-the-personal-web-a-follow-up-guide/) about the IndieWeb people could use to get started and immersed into the subculture.
* I went through and made sure my website worked for people who have [**disabled Javascript**](https://brennan.day/respecting-the-no-js-choice-making-your-site-work-for-everyone/) on their web browser (or who don't have it at all, in the first place). Developers who rely on heavy frameworks like React or Vue are creating websites that will work for *most* people, sure, but not everyone. Creating an accessible website for everyone means *everyone*.

<figure>
<img src="/assets/images/blog/tilde.jpg" alt="A terminal-style personal website for ~brennan@TTBP. Features ASCII art flowers and plants in a garden scene on a rainbow background. Below is a rainbow emoji followed by '~brennan' ">
<figcaption>My current homepage for <a href="https://tilde.town/~brennan">~brennan@TTBP.</a> </figcaption>
</figure>

Speaking of, just a few days ago, I was accepted into the wonderful SSH-based [Tilde.town](https://tilde.town/), yet another community of lovely people that's invisible to those who have the typical understanding of the Internet. It is so exciting that I can boot up my ancient ThinkPad X200T into a terminal-only interface (the kind that was standard in DOS and pre-Windows 95) and actually be able to play fun games, communicate with people, and write in [my new journal](https://tilde.town/~brennan/blog/index.html#).

The Internet is full of amazement and goodness. You just need to know where to look for it. And you need to start looking! Invest your time and energy into something that you truly own and share it with others. Imagine what we can build together going forward.
