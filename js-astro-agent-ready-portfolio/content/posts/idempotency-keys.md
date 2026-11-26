---
title: Idempotency keys, explained
description: Why a payments API needs them, the three cases a key has to handle, and the table that makes retries safe.
published: 2025-05-12
tags: [backend, reliability, payments]
projects: [outboxer]
cover: /images/demo/blog/idempotency-keys.jpg
---

At Brightpay I spent a good part of four years on one question: what happens when a client sends the same payment twice? This post is the answer I wish I had on day one.

## The problem is the timeout

A client sends `POST /charges`. The API charges the card, writes the result, and sends the response. The response never arrives: a phone loses signal, a proxy times out. From the client's side, nothing happened. So it retries.

Without protection, the retry charges the card again. Telling clients not to retry does not work, because retrying is the right thing to do when you do not know if a request succeeded.

![Sequence diagram: the client's first request charges the card but the response is lost; the retry with the same key returns the stored response](/images/demo/blog/retry-sequence.webp "The retry carries the same key, so it gets the first attempt's answer instead of a second charge.")

## The key

The client makes up a random key per operation, not per request, and sends it with every attempt:

```http
POST /charges
Idempotency-Key: 7f3a9c2e-1b4d-4e8a-9f0c-2d6b8a1e5f37
```

The server stores the key with the response. When the same key arrives again, it returns the stored response and does nothing else.

## Three cases

That sounds like a cache, but a key has to handle three situations, and the third is where bugs live:

1. **New key.** Insert it, do the work, store the response.
2. **Finished key.** Return the stored response, byte for byte.
3. **Key in progress.** The first attempt is still running. Return `409 Conflict` and let the client retry later. Do not wait, and do not start the work again.

The table that handles all three:

```sql title="idempotency_keys.sql"
create table idempotency_keys (
  key          text primary key,
  account_id   bigint not null,
  request_hash bytea not null,
  status       text not null check (status in ('started', 'finished')),
  response     jsonb,
  created_at   timestamptz not null default now()
);
```

The insert in case 1 is `insert ... on conflict do nothing`. If it inserted a row, this request owns the key. If it did not, read the row and you are in case 2 or 3. The primary key does the locking for you.

> [!IMPORTANT] Check the request too
> Store a hash of the request body. If a key comes back with a different body, return `422`. It is a client bug, and returning the old response would hide it.

## The part outside the database

The charge itself goes to a card network, which is not in your transaction. If the process dies after the charge but before storing the response, the key is stuck in `started`.

We fixed that with an outbox: the API writes the intent to charge in the same transaction as the key, and a separate relay talks to the card network and records the result. That pattern became [Outboxer](/projects/outboxer), a small Go library I still maintain.

## Results

Over the three years after we shipped keys, the API handled a few billion requests and produced zero double charges that we could trace to retries. Support went from weekly double-charge tickets to none. The keys cost one table and about two hundred lines of code.
