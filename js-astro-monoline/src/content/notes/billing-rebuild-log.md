---
title: What I wrote down during the eleven weeks we rebuilt the billing page
date: 2024-10-28
description: A week-by-week log of rebuilding the billing settings page, with the mistakes left in.
tags: [process]
---

Last spring the billing settings page produced more support tickets than any other screen in the product: 212 in the quarter before we touched it. Karim, who runs support, sent me the spreadsheet in February with one sentence: "Please." This is what I kept in my notebook while we rebuilt it. I have tidied the spelling and left the mistakes.

## Weeks 1 to 3: reading tickets

I read all 212 tickets, which took two evenings and one weekend morning. About 60 of them were the same question in different words: where do I change the card that gets charged? The card form was on the page. It was just below a table of invoices that was so long people stopped scrolling.

Maybe a third of the tickets were about invoices, and most of those were asking for a VAT number to appear on a PDF that already had one. The number was there, in grey, at the bottom.[^1]

### What I decided not to fix

There were requests for annual billing, for team-level budgets, for a dozen things that were real needs. I wrote them on a separate page and told Karim they were a different project. This was the hardest part of the first three weeks, because every one of them was a good idea.

## Weeks 4 to 6: the first wrong version

My first design put the card, the plan, and the invoices in three tabs. It looked tidy. Ngozi, who has built the front end of that page for two years, looked at it for about a minute and asked how a person would find out what they were paying.

> The plan name told you nothing, and the price lived two tabs away.

I wrote that sentence in my notebook that night and felt a bit sick. The tabs hid exactly the information people came to the page to see. I had organised it by what the system stores rather than by what a person worries about.

## Weeks 7 to 9: one page, three questions

The second version had no tabs. It opens with one sentence that says what you pay and when: "You pay $48 a month. Your next payment is on 3 June." Under it, the card, with a change button. Under that, invoices, limited to the last six, with a link to the rest.

I tested it with five customers on a call, in the style I describe in my [review rules](/notes/design-review-rules): I did not explain anything, I asked people to change their card and find last month's invoice. Four of five did both in under a minute. The fifth was looking for the VAT number and found it, grey and small, at the bottom of the PDF. We made it black.

### Smaller changes that mattered

- The invoice list shows the amount first, then the date.
- The "Update card" button says "Change card" because three testers called it that.
- Failed payments get a banner at the top of the page, not just an email.

## Weeks 10 and 11: shipping

We shipped on a Tuesday, because Ngozi said never ship billing on a Friday and I had no counter-argument. I watched the ticket queue all day. By Thursday the count of billing tickets was down to six for the week, from about 17 before.[^2]

I did not feel triumphant. I felt like someone who had finally put the card form where it should have been in the first place.

## What I would do differently

Karim and I still disagree about one thing. He thinks the sentence at the top of the page should also list the next three charges. I think a person who wants that will open the invoices. We have not tested it, and we have both agreed not to argue until we do.

I would read the tickets earlier and design later. The first wrong version cost me almost three weeks, and the information that would have prevented it was in a spreadsheet I already had.

I would also keep the "different project" page visible. In September, Karim asked about annual billing and I could hand him a page with the original request, dated February. He was pleased to be proven right, and I was pleased the note existed.

Over the eleven weeks I filled about forty pages of a notebook, and I now think the useful part was not the design thinking. It was the daily line at the top of each page that said what I was afraid of that day. Week 2: that I would miss something in the tickets. Week 5: that Ngozi would hate the tabs. Week 8: that nobody would use the single page. Writing the fear down made it smaller most days, and on the days it did not, it at least made the next step obvious.[^3]

The page has been live for sixteen months at the time I am tidying this, and the billing ticket count has stayed under ten a week. Every few months someone asks for tabs again, and I show them the line about the plan name.

[^1]: Grey text at 11px on a white PDF. I measured the contrast once and then wished I hadn't.

[^2]: Weekly counts are from Karim's spreadsheet, which counts a ticket as billing if it has the `billing` label. Some get mislabelled, so treat the numbers as rough.

[^3]: Stolen, loosely, from a talk by a designer whose name I have forgotten. If it was you, thank you.
