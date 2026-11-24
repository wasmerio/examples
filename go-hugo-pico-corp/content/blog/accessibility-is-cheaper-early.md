---
title: "Accessibility is cheaper early"
date: 2026-01-15
author: "Ines Kruger"
description: "The cost of WCAG conformance depends almost entirely on when you start. Retrofitting a finished product costs several times more than building it in."
summary: "The cost of conformance depends almost entirely on when you start. Retrofitting is several times more expensive."
image: images/blog-design-systems.jpg
imageAlt: "Keyboard focus ring visible on an interface control"
categories: ["Design"]
tags: ["accessibility", "design systems", "process"]
---


Every audit we have been handed after a launch contained the same categories of
finding: focus order, form labels, colour contrast, and error messages announced to
nobody. All four are nearly free to get right during development and expensive to
fix afterwards, because by then they are distributed across every screen.

## Why retrofitting costs more

A contrast failure in a design token is one change. The same failure discovered
after launch is one change plus regression testing of every screen that uses it,
plus a stakeholder conversation about the brand colour, plus a release.

On a recent project we compared the two paths honestly. Building conformance in
added roughly 6% to the design and frontend effort. The client's previous product,
audited after launch, had cost about a third of a rebuild to remediate.

## What we put in the contract

WCAG 2.2 AA as a stated deliverable. Keyboard and screen reader testing during
development, not at the end. Automated checks in continuous integration so a
regression fails the build. And an external audit before launch, because we are not
the right people to mark our own work.

## The commercial argument

Public sector procurement in the EU increasingly requires a conformance statement.
Two of our clients have won tenders where a competitor was excluded for lacking one.
That is a stronger argument in most boardrooms than the ethical one, which is a
slightly depressing observation, but it is the one that gets budget approved.

