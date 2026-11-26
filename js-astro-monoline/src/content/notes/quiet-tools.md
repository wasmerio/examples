---
title: Quiet tools
date: 2025-05-30
description: Why most of my daily tools are plain text, and the one command I run every evening.
tags: [tools]
---

Over the last year I replaced a handful of apps with files. My to-do list is a text file. My meeting notes are text files. My weekly plan is a text file with a dated heading. None of this is clever, and I do not recommend it to everyone. It suits me because I do not need to decide how something looks before I write it.

The only automation I have is a single command that I run at the end of the day. It copies today's notes to a folder that gets backed up.

```sh
cp ~/notes/today.txt ~/notes/archive/$(date +%F).txt
```

I did not write that line myself. Sven in our infrastructure team wrote it on a napkin after I asked him how to avoid losing a day's work. It has run 211 times since then, and I have needed the archive twice.

## What I miss

Search is worse than in a proper notes app. I can find a word, but I cannot find a thought. When I know I wrote something about onboarding in the spring, I scroll through filenames and open four of them before I find it. That is a real cost and I accept it.

I also miss reminders. A text file does not tap me on the shoulder. I use the calendar for anything with a time attached, and I let the text file hold only things that can wait.

The setup is close to how I write these [short notes](/notes/css-for-notes) for this site, which are plain text files first and web pages second.
