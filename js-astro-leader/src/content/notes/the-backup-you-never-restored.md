---
title: 'The backup you never restored is not a backup'
category: 'infra'
pubDate: 2026-05-27
description: 'Restoring from my own backups once a quarter, and what broke the first three times.'
work: tideline
---

I started restoring from my own backups on a quarterly schedule back in 2024, well before Tideline existed as a project, after losing a client's database to a migration that silently broke the nightly dump for six weeks. Nobody noticed because the backup job reported success every night. It was successfully backing up nothing useful, and it took a real incident to teach me that a green checkmark on a backup job proves the job ran, not that the backup works.

Since then, every quarter, I pick one backup and actually restore it into a throwaway environment. Not verify the file exists. Not check the size looks about right. Actually bring a database up from it and run a query against it. In roughly two years of doing this, three restores out of the first eight failed outright, and each failure taught me something the "backup succeeded" message had been hiding.

## The first three failures

The first was the migration I mentioned: a schema change on the source database that the dump script did not know how to handle, so it wrote out an empty file with a valid-looking header. The second was a credentials rotation. The backup job's stored password expired, and the job's error handling logged a warning instead of failing loudly, so the last good backup quietly aged for eleven days before anyone restored anything. The third was the most embarrassing: a backup that restored fine but was missing an entire table, because a script I had written months earlier excluded it by name for a one-off debugging session and I forgot to remove the exclusion.

None of those three would have shown up in a monitoring dashboard that only checks whether the backup job exited with status zero. All three showed up within the first ten minutes of an actual restore.

## Why I'm building Tideline around this

Tideline's whole reason for existing is to make the "have you actually restored this" question part of the tool instead of a habit I have to remember to keep. The dashboard will not show a plain green check for a backup that has never been restored, even if every scheduled run has succeeded. I want the unverified state to look visibly different from the verified one, because in my own quarterly habit, the difference between those two states is exactly what caught all three failures above.

It is early. Right now Tideline handles the scheduling and the check-in half of this well and the restore-verification half not at all, which is next on the list. Until it does, I am still doing the quarterly restore by hand, the same way I have been since 2024, because the habit predates the tool and the tool has not replaced it yet.
