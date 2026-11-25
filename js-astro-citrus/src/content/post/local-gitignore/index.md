---
title: "Local .gitignore"  
description: "How to create an additional .gitignore file"  
publishDate: "05 Mar 2025"  
tags: ["git", "gitignore"]  
draft: true
---

## How to create `.local.gitignore` that is not synchronized with Git?

1. **Create the `.local.gitignore` file**  
   ```bash
   touch .local.gitignore
   ```

2. **Add it to `.git/info/exclude`** (so Git applies it locally)  
   ```bash
   echo ".local.gitignore" >> .git/info/exclude
   ```

3. **Configure Git to treat `.local.gitignore` as `.gitignore`**  
   ```bash
   git config --local core.excludesfile .local.gitignore
   ```

Now **`.local.gitignore` will work like a regular `.gitignore`, but only for you**.  

## How does it work?
- `.local.gitignore` is not added to the repository.  
- It is applied **only locally** on your computer.  
- It works **like `.gitignore`**, but other developers don't have it.  
- Git **does not see this file** thanks to `.git/info/exclude`.  

**Now you can add local files to it**:  
```bash
echo "my-secret-file.txt" >> .local.gitignore
echo "debug_logs/" >> .local.gitignore
```

:::caution
Before performing a commit rollback, you must manually backup the files listed in `.local.gitignore`. This is because files ignored by `.local.gitignore` are not tracked by Git and will be lost if you rollback the commit. Git will not restore these files as they were not committed or staged.
:::