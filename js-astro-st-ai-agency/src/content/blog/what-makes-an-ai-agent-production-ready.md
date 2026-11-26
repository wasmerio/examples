---
title: What Makes an AI Agent Production Ready
description: A practical checklist for the gap between "it works on my laptop" and "it runs on Monday morning without us".
pubDate: 2026-07-16
category: Engineering
author: Owen Marsh
authorRole: Platform & security
image: /images/blog-production-ready.webp
imageAlt: Colourful source code in a code editor
tags: [Engineering, Production, Checklist]
---

Plenty of agents work in a demo. Far fewer are ready for production traffic. The gap is rarely the model. It is everything around it: permissions, limits, observability and a clear plan for when things go wrong.

This is the checklist we walk through before any agent sees a real customer.

## 1. A labelled evaluation set exists — and passes

Before launch there should be a set of real, anonymised cases with agreed correct outcomes. The agent runs against it on every change. If you cannot say what score it achieved on the latest run, it is not ready.

## 2. Permissions are minimal and explicit

The agent should have exactly the access its workflow needs:

- read access to the records it must look up,
- write access only to the fields it is allowed to change,
- no access at all to anything else.

Use separate credentials per agent so access can be revoked without collateral damage.

## 3. There is a hard spend limit

Every task has a budget for model calls and tool calls. When it is exceeded, the task stops and goes to a human queue. This one rule prevents the most expensive class of incident: a loop that quietly retries all night.

## 4. Every run can be replayed

For any completed task you should be able to see the input, each model call, each tool call with its response, and the final action. Store this long enough to answer the questions an auditor or an unhappy customer might ask months later.

## 5. Escalation is designed, not improvised

When the agent stops, a person receives a packet that lets them finish the job without starting again: what was asked, what was found, what was attempted and why it stopped.

## 6. Failure modes have owners

Write down the likely failures — upstream system down, unexpected input format, model provider outage — and who responds to each. Put the agent on the same on-call rotation as any other production service.

## 7. Changes are deployed like code

Prompts, tool definitions and routing rules live in version control, go through review and can be rolled back in one step.

## 8. Someone outside the build team signs off

Finally, the operations owner — the person whose team lives with the result — reviews the evaluation results and agrees to the launch. If they are not comfortable, it is not ready.

---

None of these items is exotic. That is the point. Production readiness for an AI agent looks a lot like production readiness for any other system, with one extra discipline: **measuring quality continuously**, because the inputs will keep changing even when your code does not.
