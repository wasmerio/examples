---
# A fictitious profile for testing the about page layout (LEMMA_ABOUT=sample,
# bun run dev:sample). Every person, place and paper here is made up.
title: About
name: Lin Qiao
tagline: Postdoctoral researcher · Institute for Computational Science, Northlake University
links:
  - { label: Email, href: 'mailto:lin.qiao@example.org' }
  - { label: CV, href: cv.pdf }
  - { label: Google Scholar, href: 'https://scholar.example.org/citations?user=abc123' }
  - { label: GitHub, href: 'https://github.com/example-lqiao' }
  - { label: ORCID, href: 'https://orcid.org/0000-0000-0000-0000' }
  - { label: ResearchGate, href: 'https://www.researchgate.example/profile/Lin-Qiao' }
  - { label: Mastodon, href: 'https://mathstodon.example/@lqiao' }
  - { label: Office hours, href: 'https://example.org/office-hours' }
self: ['Qiao, Lin', '乔林']
sections:
  # Blocks named by `kind:`. activity: a year of GitHub contributions,
  # fetched at build time and always shown right after the bio, wherever it
  # is written. Without `github:` it shows those of site.links.github in
  # lemma.config.mjs, so this fictitious profile shows the site owner's real
  # calendar.
  - kind: activity
    heading: Activity
  # now: what you are doing, and the local time of timezone (an IANA name).
  - kind: now
    text: Writing up learned closures for multiscale kinetics, and teaching a reading course on spectral methods.
    updated: Oct 2026
    place: Northlake
    timezone: Asia/Shanghai
  - kind: facts
    heading: At a glance
    facts:
      - { label: Based in, value: 'Northlake, China' }
      - { label: Office, value: 'Room 412, Science Building B' }
      - { label: Languages, value: 'Chinese, English, some German' }
      - { label: Writes in, value: 'LaTeX, Typst, Markdown' }
      - { label: Open to, value: 'Collaborations on operator learning', href: 'mailto:lin.qiao@example.org' }
  - kind: stack
    heading: Interests and tools
    groups:
      - { label: Research, tags: [Operator learning, Spectral methods, Stiff PDEs, Multiscale kinetics, Scientific ML] }
      - { label: Languages, tags: [Python, Julia, C++, Fortran] }
      - { label: Tools, tags: [JAX, PyTorch, FEniCS, Dedalus, LaTeX, TikZ] }
  # The title links to href, else to repo. Stars are written by hand here;
  # without `stars:` they are fetched from GitHub.
  - kind: projects
    heading: Software
    projects:
      - title: sno
        note: Spectral neural operators in JAX, with the stiff solvers and learned closures from the NeurIPS paper.
        repo: 'https://github.com/example-lqiao/sno'
        href: 'https://example.org/sno'
        stars: 412
        when: 2025
      - title: harbor
        note: Benchmarks for learned closures on turbulent channel flow.
        repo: 'https://github.com/example-lqiao/harbor'
        stars: 57
        when: 2024
      - title: tikz-pde
        note: TikZ styles for meshes, stencils and phase portraits.
        repo: 'https://github.com/example-lqiao/tikz-pde'
        stars: 9
        when: 2022
      - title: northlake-notes
        note: Lecture notes for the reading course, with no year and no site of their own.
        repo: 'https://github.com/example-lqiao/northlake-notes'
        stars: 0
  - heading: Experience
    items:
      - when: 2025 – now
        title: Postdoctoral Researcher, Institute for Computational Science
        subtitle: 'Northlake University · Host: Prof. Mira Halvorsen'
        note: Operator learning for stiff multiscale systems; spectral methods with learned closures.
        href: 'https://example.org/ics'
      - when: 2024
        title: Research Intern, Fluid Dynamics Group, Harborview Labs
        subtitle: Summer, three months
        links:
          - { label: Report, href: 'https://example.org/report.pdf' }
          - { label: Code, href: 'https://github.com/example-lqiao/harbor' }
  - heading: Education
    items:
      - when: 2020 – 2025
        title: PhD in Applied Mathematics, Northlake University
        subtitle: 'Thesis: Spectral neural operators for reaction–diffusion systems with very stiff and strongly nonlinear source terms'
        note: Advisor Prof. Wen Zhou. Graduated with distinction.
        href: 'https://example.org/thesis'
      - when: 2016 – 2020
        title: BSc in Mathematics, Eastbridge University
  # No list of its own: the papers marked selected in the sections below.
  - heading: Selected publications
    selectedOnly: true
  - heading: All publications
    publications:
      # Every field: url (the title links to it), pdf, arxiv, doi, extra links, bibtex.
      - title: 'Spectral Neural Operators for Stiff Reaction–Diffusion Systems: Stability, Approximation Rates, and Learned Closures for Strongly Nonlinear Source Terms on Periodic and Bounded Domains'
        authors: [Xiaoyu Chen, Anna-Lena Müller, Lin Qiao*, Haoran Wang, et al.]
        venue: Advances in Neural Information Processing Systems
        year: 2025
        selected: true
        url: 'https://example.org/papers/sno'
        pdf: 'https://example.org/papers/sno.pdf'
        arxiv: '2505.01234'
        doi: 10.5555/neurips.2025.01234
        links:
          - { label: Code, href: 'https://github.com/example-lqiao/sno' }
          - { label: Slides, href: 'https://example.org/sno-slides.pdf' }
          - { label: Video, href: 'https://video.example.org/sno' }
          - { label: Poster, href: 'https://example.org/sno-poster.pdf' }
        bibtex: |
          @inproceedings{qiao2025spectral,
            title = {Spectral Neural Operators for Stiff Reaction--Diffusion Systems},
            author = {Chen, Xiaoyu and M{\"u}ller, Anna-Lena and Qiao, Lin and Wang, Haoran and others},
            booktitle = {Advances in Neural Information Processing Systems},
            year = {2025},
          }
      # A local file as the PDF (served at /about/thesis.pdf).
      - title: Spectral Neural Operators for Reaction–Diffusion Systems
        authors: [Lin Qiao]
        venue: PhD thesis, Northlake University
        year: 2025
        pdf: thesis.pdf
      - title: Stability of Pseudo-Spectral Schemes with Learned Closures
        authors: [Lin Qiao, Wen Zhou]
        venue: Journal of Computational Physics
        year: 2024
        selected: true
        doi: 'https://doi.org/10.5555/jcp.2024.113'
        bibtex: |
          @article{qiao2024stability,
            title = {Stability of Pseudo-Spectral Schemes with Learned Closures},
            author = {Qiao, Lin and Zhou, Wen},
            journal = {Journal of Computational Physics},
            year = {2024},
          }
      - title: 刚性反应扩散方程的指数积分谱方法
        authors: [陈晓宇, 乔林, 周文]
        venue: '中国科学: 数学'
        year: 2024
        doi: 10.5555/scm.2024.0401
      # No links and no BibTeX: no link row.
      - title: 'Learned Closures Fail Gracefully: A Negative Result'
        authors: [Lin Qiao, Chidi Okafor, Wen Zhou]
        venue: ICLR Workshop on Physics for Machine Learning
        year: 2023
        note: Oral
      - title: On the Expressivity of Fourier Neural Operators
        authors: [Haoran Wang, Mira Halvorsen, Lin Qiao]
        venue: arXiv preprint
        year: 2022
        arxiv: 'arXiv:2210.04567'
      # No year: shown last.
      - title: Learned Closures for Multiscale Kinetics
        authors: [Lin Qiao, Mira Halvorsen]
        note: In preparation
  # The latest posts in this language.
  - kind: posts
    heading: Recent writing
    limit: 3
  - heading: Talks
    items:
      - when: 2025-11-14
        title: Learning closures for stiff PDEs
        subtitle: Applied Analysis Seminar, Eastbridge University
        links:
          - { label: Slides, href: 'https://example.org/talk-slides.pdf' }
      - when: Jun 2024
        title: Spectral neural operators
        subtitle: SIAM Conference on Mathematical Aspects of Materials Science (contributed talk), Pittsburgh
  # An empty section: left out of the page.
  - heading: Teaching
    items:
  - heading: Awards
    items:
      - when: 2024
        title: Outstanding Graduate Student Award
      - title: Reviewer for several journals (no date on this item)
        note: Journal of Computational Physics, SIAM Journal on Scientific Computing.
  # No item has a date: the list takes the full width.
  - heading: Service
    items:
      - title: Organiser, Northlake numerical analysis reading group
        note: Fortnightly, on spectral methods and operator learning.
      - title: Mentor, undergraduate research programme
---

I work on numerical analysis and machine learning for partial differential equations, in particular **operator learning** for stiff reaction–diffusion systems, where the solution operator $\mathcal{G}: u_0 \mapsto u(\cdot, T)$ must be learned from few trajectories. Before that I studied spectral methods at [Northlake University](https://example.org).

I am on the job market in 2026.
