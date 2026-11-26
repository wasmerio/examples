---
title: outboxer
description: A transactional outbox for Go and PostgreSQL. Write the event in the same transaction as your data, and a relay delivers it at least once.
repo: https://github.com/alexrivera/outboxer
updated: 2026-09-14
---

![Editor showing charge.go, where outbox.Add runs in the same transaction as the charge, and a terminal with the relay delivering events](/images/demo/projects/outboxer.webp "The event is written in the charge's transaction; the relay delivers it afterwards.")

Outboxer solves one problem: you changed your database and need to tell another system about it, and both have to happen or neither does.

Writing to the database and then publishing to Kafka is two steps. If the process dies in between, the event is lost. Publishing first is worse, because the write can still fail. The outbox pattern writes the event to a table in the same transaction as the data, and a separate relay publishes it.

## Usage

```go title="charge.go"
err := db.Tx(ctx, func(tx pgx.Tx) error {
	if err := s.charges.Insert(ctx, tx, charge); err != nil {
		return err
	}
	return s.outbox.Add(ctx, tx, outboxer.Event{
		Topic: "charges.created",
		Key:   charge.ID,
		Body:  charge,
	})
})
```

Then run the relay, in the same process or on its own:

```go
relay := outboxer.NewRelay(pool, kafkaPublisher, outboxer.Every(200*time.Millisecond))
go relay.Run(ctx)
```

## Guarantees

- **At least once.** A crash after publishing and before marking the row sent means the event goes out again. Consumers should be idempotent; [Idempotency keys, explained](/blog/idempotency-keys) covers how.
- **In order per key.** Events with the same key are published in the order they were written.
- **Safe with many relays.** Relays claim rows with `for update skip locked`, so you can run several.

Outboxer grew out of the payments API at Brightpay, where it has delivered every charge event since 2020.
