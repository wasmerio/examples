---
title: Why accountants export invoices
date: 2026-09-21
description: Fourteen interviews and a month of support tickets on why people leave our product to look at their invoices somewhere else.
tags: [research, process]
---

In June Karim sent me a number I could not stop thinking about. In the previous quarter, 1,840 people had clicked "Export" on the invoice list, and 1,310 of them had done it more than once in the same week. Nobody asks for a CSV that often because they enjoy it. Something was being finished somewhere else, and I wanted to know where.

I spent July and August on it. I interviewed fourteen accountants and bookkeepers, nine of them in Rotterdam, Utrecht and Antwerp, five remote. I also read 140 support tickets that mentioned export, and I sat next to Dina in support for two afternoons while she answered them. This is the write-up. It is long because I would rather you could check my reasoning than take my word for it.

## What I was trying to find out

The first brief said "improve the export". I pushed back on that, because an improved export would be a better way of doing something we did not understand. The question I wrote at the top of my notebook was smaller: what happens to an invoice after it leaves the list?

I had three guesses going in. The first was that people export because our reports are too thin. The second was that they export because their accounting package at the firm cannot read our data any other way. The third was that it is a habit nobody has examined. I was wrong about the proportions, as it turned out, but each guess had somebody in it.

### Who I talked to

Eight worked at small firms with fewer than ten people. Four were in-house at a company with one or two hundred staff. Two were freelance bookkeepers who look after between six and twenty clients each. I recruited through our customer list and through Tomás Ferreira, who knows half the accountants in Zuid-Holland and was generous with introductions.

I used the [interview questions](/notes/interview-questions) I keep for this kind of session, with one change: I asked people to open the last file they had exported, in the room, and walk me through what they did with it. That one request produced more than the rest of the script together.

| Group      | People | Typical clients | Exports per week |
| ---------- | ------ | --------------- | ---------------- |
| Small firm | 8      | 30 to 120       | 4 to 15          |
| In-house   | 4      | 1               | 1 to 3           |
| Freelance  | 2      | 6 to 20         | 5 to 9           |

The sample is small and I picked it partly by who answered email.[^sample] I do not think the shape of the findings would change with forty people, but the percentages would.

---

## What I heard

### Reason one: the invoice is evidence, and evidence has to be somewhere permanent

Eleven of fourteen said, in one form or another, that they do not trust a tool to be the only place a record lives. Marieke, who runs a four-person firm in Delft, put it plainly:

> I'm not saying your system will disappear. I'm saying that in seven years a tax inspector will ask me for a March invoice, and I want to open a folder, not a login.

That changed how I read the 1,310 repeat exports. Some of them were not working sessions at all. They were filing. At the end of every month several people export the whole list, rename the file to something like `2026-08_invoices_final.csv`, and put it in a shared drive next to the bank statements.

![Four boxes joined by arrows: invoice list, export .csv, rename file, shared drive. Under them: 1,310 repeat exports, by month, next to the bank statements.](./images/export-path.svg)

### Reason two: the number they need does not exist in our product

This was the biggest group, and it is the one my first guess got partly right. People were not complaining that our reports are thin. They were complaining that the figure they needed was a combination of two things we show on different screens.

The most common was VAT by rate, per quarter, across all clients, with credit notes netted off. Three people described the same spreadsheet without having seen each other's. Their steps were remarkably similar:

- Export all invoices for the quarter.
- Export all credit notes for the quarter, separately.
- Paste both into one sheet and sort by VAT rate.
  - Some also add a column to flag invoices paid after the quarter closed.
  - Two of them colour those rows yellow by hand, which they do every quarter and which takes about forty minutes.
- Check the total against the figure on the return.

The last step is the one that matters. They do not trust our total until it matches something else they trust, and the only way to make it match is to take the data out where they can see every line.

### Reason three: someone else asked

Six people export mostly because a third party wants a file. An auditor, a bank, a landlord, a client's own accountant. Here the format is not theirs to choose. A woman at a Utrecht firm told me that one client's bank insists on a particular column order, and she has a saved template that she pastes into every month.

Here is the script I used for the "open your last file" part. I am including it because the wording mattered. Early on I asked "why did you export that?" and got answers like "to look at it", which told me nothing.

```text
Open the last file you exported. Don't tidy it first.

1. What is this file? Tell me what is in it, as if I were new.
2. Where did it come from? Which screen, which filter?
3. What did you do in the first two minutes after it opened?
4. Who else has seen this file?
5. Where is it now? Show me.
6. If you hadn't had it, what would you have done instead?
```

Question six was the useful one. For about half the exports the honest answer was "waited until Monday", which is a way of saying the export was not a workaround for a missing feature. It was a way of not being blocked.

## What surprised me

I expected people to resent exporting. Only two did. The rest described it with something close to affection: it was the moment the data became theirs, in a tool they had used for twenty years, with formulas they trusted.

I also did not expect how little of the data they used. In the files I looked at, people kept six or seven columns of the twenty-two we export and deleted the rest in the first minute. The columns they kept were the same across almost everyone: invoice number, date, client, net, VAT rate, VAT amount, gross. Nobody kept our internal status field.[^2]

Wren asked at a review whether this meant we should simply export fewer columns. I think that is a fair reading and probably a quick win, but it ignores that the deleted columns are the ones the 3 or 4 unusual cases need. The kept columns are the typical case. Typical cases are cheap to serve once you know them.

### What the tickets added

The 140 tickets split roughly like this:

1. How do I export one client only (41)
2. The CSV opens wrongly in Excel (29)
3. Where is the credit note in the export (24)
4. Can I schedule it (18)
5. Other (28)

The second group was a surprise to me and an old story to Karim. Dutch Excel expects a semicolon as the separator and a comma as the decimal mark. Ours writes the opposite. Dina has a macro for fixing it, written in 2022, which she emails to people from her own account.

### One afternoon in Delft

The interview I keep returning to was Marieke's. She had a printout of the quarter's VAT sheet on her desk, with a green pen tick next to roughly four lines in five. I asked what the ticks meant. She said they were invoices she had checked against the bank, one at a time, because last year a client paid an invoice twice and it took until October to notice.

She was not checking our product. She was checking her clients, and the export was the only form of our data that fits on a page she can hold. That reframed several earlier interviews for me. When Priya read my notes she pointed out that "export" might be the wrong word for the feature altogether, and that people might be asking for a printable ledger view. I am not sure she is right, but I have stopped using the word in my own notes. I write "take out" now, and see whether it changes what I notice.

## What I recommend

I wrote this section last and rewrote it three times, because the first version was a feature list. The first two items were small enough that they went into Ngozi's queue in August without a discussion: export one client only, and write the CSV with a semicolon and a decimal comma when the account is set to Dutch. That is why the list below starts at three.

3. Treat the monthly archive as a job of its own. A single "Download this month's records" button that produces files with folder-friendly names would remove perhaps a third of the repeat exports, by my reckoning, without anyone having to change their habit.
4. Cut the default export to the seven columns people keep, and put the rest behind a "More columns" switch, so the unusual cases are still served.
5. Build the quarterly VAT view only after we have watched five more people do it, because the three descriptions I have are close but not identical, and I would rather get the netting rule from the people who live with it.

I did not recommend a scheduled export, though 18 tickets asked. Nobody in an interview mentioned wanting one. Tickets are people who already know the word they want; interviews are people showing me what they do.

## What I would do differently

I would have asked for the file earlier. The first four interviews used the old script and I had to redo two of them by phone. I would also have talked to at least one person who has stopped exporting, and I could not find one. If you know an accountant who used to leave our product for their invoices and no longer does, I would like to meet them.

The raw notes, with names removed, are in the shared research folder. The summary I sent to the team was one page and mostly a version of the list above. The handoff to Ngozi for the separator fix is in the usual [handoff doc](/notes/handoff-doc) format, and the VAT view goes on the next planning round once I have the five observations. A shorter version of this went into the [status updates](/notes/status-updates) the week it was done.

[^sample]: Fourteen interviews is enough to find the common reasons and not enough to say how common each is. When I write "eleven of fourteen" in this note, read it as "most, and I can show you the eleven", not as a market share.

[^2]: The status field is a legacy of the old billing model and says things like "pending_review". Only support staff understand it. Dina says three people have asked her what it means, and each time she has had to look it up.
