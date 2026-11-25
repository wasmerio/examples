---
title: "The Case for Small Integration Tests"
excerpt: "A narrow integration test can catch contract drift without turning the suite into a slow imitation of production."
category: "Engineering"
date: 2026-07-08
author:
  name: "Leah Morgan"
  role: "Design systems and craft"
cover:
  src: "./cover.jpg"
  alt: "Blurry blue and yellow abstract background"
  creditName: "Credits to Solen Feyissa via Unsplash"
  creditUrl: "https://unsplash.com/photos/a-blurry-image-of-a-blue-and-yellow-background-3BxjA6QDowk"
featured: false
---

Teams often talk about integration tests as if there are only two choices: mock everything or recreate production. There is a third path. Test the smallest real contract that has caused bugs before.

Small integration tests are not comprehensive. That is why they work.

## Pick the boundary that breaks

Start with contracts between your application and the things that change independently: database migrations, payment webhooks, search indexing, auth callbacks, generated SDKs, and queue payloads.

The question is not "can we test the whole workflow?" The question is "which boundary do we keep misunderstanding?"

```ts
test("webhook payload matches the queue contract", async () => {
  const payload = await fixture("payment-succeeded.json");
  expect(toQueueMessage(payload)).toMatchObject({
    type: "payment.succeeded",
    accountId: expect.any(String),
  });
});
```

## Keep setup boring

Use fixtures that explain the contract, not fixtures that clone production. Avoid time-dependent data unless time is the contract. Keep external services in sandbox mode or local containers with a narrow scope.

If the setup takes longer to read than the assertion, the test is doing too much.

## Run them where they matter

Small integration tests should run in pull requests when they protect shared contracts. Slower contract suites can run before release. The important part is making failures actionable: tell engineers which boundary changed and why it matters.

A good integration test is a useful conversation with the system.
