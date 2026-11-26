---
title: 'Five things in the schedule data this week'
dek: 'Sailing schedules are the cheapest forecast in freight, and most of the useful signal is in the boring columns.'
date: 2026-07-21
topics: ['Capacity', 'Methods']
---

I read sailing schedules the way some people read the weather page: not for the headline, but for what changed since yesterday. A schedule is a promise carriers make to themselves, and the edits to it are where the promises get quietly revised. This week I diffed four weeks of published Asia to Europe and transpacific schedules. Five things came out of it.

1. **Tuesday is the day schedules get edited.** Of 212 revisions I logged across 38 services, 71 landed on a Tuesday between 14:00 and 18:00 Singapore time. Carriers do not announce this. It is simply when the network planners finish their weekly meeting and someone has to update the file. If you pull your data on Monday, you are always a week behind the people who pull it on Wednesday.

2. **Three services lost a port call and kept their name.** The Asia to Mediterranean loop that used to call Piraeus, Genoa and Valencia now calls Piraeus and Valencia. The service code is unchanged, the rotation count is unchanged, and the transit time to Genoa on the website is still 31 days. Nobody has updated the web page. The schedule feed, however, shows the omission three weeks out, which is where you should be looking.

Here is the part that matters for anyone with cargo booked into Genoa, and it is a short walk from the schedule file to a surcharge.

<!-- cut -->

3. **Vessel substitutions are the real capacity signal.** On the third loop I tracked, a 14,000 TEU ship built in 2011 replaced a 15,200 TEU ship built in 2019 for two consecutive sailings. The service code stayed the same. Capacity on that loop fell by 1,200 TEU per week, about 8%, and no notice went out. Shippers who watch only the announced blank sailings will miss this entirely, because there was no blank sailing. There was a smaller, older ship in the same slot.

I now keep a simple column next to every service: the nameplate TEU of the vessel assigned to each of the next six departures. When the number drops and the service code does not change, I flag it. In four weeks that flag fired eleven times. Nine of those were temporary, two were not.

4. **Transit times creep before rates move.** For six services, the published port-to-port transit time lengthened by one to three days over the month, spread across several small edits. Added together, that is a slow-steaming decision or a congestion expectation, and neither was announced. In my notes, a two-day increase on a service has preceded a general rate increase announcement by an average of nineteen days across the last two years. That is a small sample, 14 cases, so treat it as a habit of the market and not a law.

A practical use: if a service you rely on adds two days to its published transit, ask your account manager what they know. They will say nothing, and the way they say it will tell you something.

5. **The cutoff times move more than the sailing dates.** Container gate-in cutoffs at origin shifted on 29 of the 38 services, usually by 12 or 24 hours earlier. Sailing dates shifted on only 9. A forwarder in Ningbo told me this is the cheapest way for a carrier to protect a tight vessel: the ship leaves on time, but the cargo that would have made it at 10:00 on Friday now needs to be there Thursday at 10:00. Bookings are not cancelled. They are made harder to complete.

If your documentation team works on a standing "Thursday afternoon" rhythm, check the cutoff on each booking confirmation as it arrives, not on the first one you received. I know of one importer who lost a full week of cargo because the cutoff on an email from June was copied into the July template.

**What to do with this**

None of these five requires a data vendor. The raw schedule files are free, they are published weekly, and a spreadsheet with three tabs is enough: one for vessel nameplate capacity, one for transit time, one for cutoffs. The discipline is the same every Tuesday evening, pull, diff, annotate.

The one piece that does take judgment is deciding which changes are noise. A port call swapped between two terminals in the same city is noise. A port call dropped from a loop is not. My rule: if the change would alter the invoice, it counts. If it only alters the drive, it does not.

Next week I will take this approach to the rate side and show how a published rate card disagrees with the rates people actually pay. There is a table, and the gap on one lane is bigger than I expected.
