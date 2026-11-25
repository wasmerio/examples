---
title: ''
date: 2026-07-11
type: landing

sections:
  # (a) Education — inside the hero, alongside the portrait and summary.
  - block: resume-biography-3
    id: education
    content:
      username: me
      text: ''
      button:
        text: Download CV
        url: uploads/resume.pdf
      headings:
        about: 'Professional Summary'
        education: 'Education'
        interests: 'Interests'
    design:
      background:
        gradient_mesh:
          enable: true
      name:
        size: md
      avatar:
        size: medium
        shape: circle

  # (b) Internship
  - block: resume-experience
    id: internship
    content:
      title: Internship
      username: me
    design:
      date_format: 'January 2006'
      hide_education: true  # the hero already shows it

  # (c) Research
  - block: collection
    id: research
    content:
      title: Research
      text: |-
        Three questions I keep circling: **AI for science**, **AI for decision-making**,
        and what data-driven methods are actually worth once they leave the benchmark.
      count: 0  # 0 = no limit. Never hide entries behind a hardcoded cap.
      filters:
        folders:
          - projects
    design:
      view: article-grid
      fill_image: false
      columns: 2

  # Publications — the section stands whether or not it has entries.
  - block: markdown
    id: publications
    content:
      title: Publications
      text: |-
        In preparation.
    design:
      columns: 1

  # (d) Skills
  - block: resume-skills
    id: skills
    content:
      title: Skills
      username: me
    design:
      columns: 2

  # (e) Additional Experience
  - block: resume-awards
    id: additional
    content:
      title: Additional Experience
      username: me

  - block: resume-languages
    content:
      title: Languages
      username: me
---


