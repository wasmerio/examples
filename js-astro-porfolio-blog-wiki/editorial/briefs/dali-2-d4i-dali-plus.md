# Editorial Brief: DALI-2, D4i, and DALI+

## Working title

**DALI-2, D4i y DALI+: qué es cada cosa y cuándo importa realmente en un proyecto**

## Editorial purpose

Give lighting professionals a practical way to distinguish DALI-2, D4i, and DALI+ without treating them as interchangeable labels. The piece should help readers evaluate specifications, ask better questions during a project, and avoid paying for a capability that the installation, controller, or commissioning process cannot use.

This is a research-led authority article, not a standards transcription or product roundup.

## Target reader

- Lighting designers, electrical engineers, and technical sales professionals who encounter the three terms in specifications or product sheets.
- Project managers and installers who need to assess interoperability, commissioning, data, and future expansion.
- Informed building owners or facility teams deciding whether connected lighting features have practical value.

Assume basic familiarity with luminaires and lighting control, but do not assume prior knowledge of DALI standards.

## Core thesis

DALI-2, D4i, and DALI+ describe related but different layers of the DALI ecosystem: DALI-2 primarily concerns the standardized control-device and control-gear ecosystem and its certification model; D4i extends DALI-2 capabilities inside luminaires, especially around data and intra-luminaire communication; DALI+ extends DALI communication to IP-based, wireless, or hybrid infrastructures through gateways and compatible devices. The right choice depends on the project requirement and system architecture, not on which label sounds newest.

The article must refine this thesis against current official terminology before publication.

## Editorial angle

Use a decision-oriented comparison rather than a chronological standards history. Start with the confusion a professional sees in a tender or datasheet, then separate the concepts by **where communication happens, what is standardized, what data is available, what infrastructure is required, and what the label does not guarantee**.

A useful framing question is: **“What problem does this label solve in this project?”**

Include a compact comparison table and at least one realistic project scenario where selecting by label alone leads to a poor outcome.

## Suggested structure

1. **Opening: three labels, one recurring project confusion**
   - Show why the terms are often presented together.
   - State that they are related, but not synonyms.
2. **The minimum DALI context**
   - Explain the role of control gear, control devices, buses/networks, commissioning, and gateways in plain language.
   - Clarify the distinction between a protocol/ecosystem label and a complete system guarantee.
3. **What DALI-2 means**
   - Explain standardization, interoperability goals, control gear/control-device scope, and certification.
   - Distinguish DALI-2 from legacy or proprietary “DALI compatible” claims.
4. **What D4i adds inside a luminaire**
   - Explain intra-luminaire features, luminaire data, diagnostics, energy data, and the role of memory banks/application data where officially applicable.
   - Explain what D4i does not automatically provide: a complete building-management system or an end-to-end connected installation.
5. **What DALI+ changes**
   - Explain the IP-based and wireless/hybrid direction, gateways, and how the DALI application layer relates to the underlying transport.
   - Avoid implying that DALI+ makes every existing DALI-2 device natively IP-capable.
6. **Comparison table: DALI-2 vs D4i vs DALI+**
   - Compare scope, location in the architecture, infrastructure, data/diagnostics, interoperability evidence, commissioning implications, and typical use cases.
7. **When each matters in a real project**
   - New wired installation.
   - Luminaire data/maintenance requirement.
   - Retrofit or distributed/wireless/IP-connected project.
   - Mixed systems requiring gateways and clear responsibility boundaries.
8. **Questions to ask before specifying or buying**
   - Turn the research findings into a practical checklist.
9. **Conclusion: specify the requirement, then the technology**
   - Re-state the thesis and point readers toward related project guidance.

## Key questions to research

### Terminology and scope

- What are the current official definitions and intended scopes of DALI-2, D4i, and DALI+?
- Which terms refer to certification, product features, application data, transport, or a broader ecosystem?
- What is the precise relationship between DALI-2 certification and D4i certification/registration?
- What does the DALI Alliance currently say about DALI+ transport options and system architecture?

### Technical behavior

- Which control gear and control-device capabilities are covered by the relevant DALI-2 parts and certification requirements?
- What D4i data is expected or optional in a luminaire, and how is it exposed to an external controller or gateway?
- What are the practical limits of intra-luminaire communication and luminaire data access?
- How does DALI+ preserve or map DALI application behavior across IP, wireless, or hybrid transport?
- What role do gateways, application controllers, commissioning tools, and network security play?

### Project decisions

- When does D4i provide measurable value for commissioning, maintenance, energy monitoring, or asset management?
- When is DALI+ justified over a conventional wired DALI-2 architecture?
- What coexistence, retrofit, and interoperability constraints should a specifier check?
- What claims can a product legitimately make, and what evidence should a buyer request?
- Which capabilities depend on the controller, gateway, firmware, or software rather than on the luminaire label?

### Market and currentness

- Which official certification or registration directories should readers use to verify products?
- Are there current terminology changes, certification rules, or DALI+ ecosystem updates that affect the article’s wording?
- Which claims vary by manufacturer and therefore must not be generalized from one product sheet?

## Source and research requirements

Prioritize primary, current sources:

1. DALI Alliance / Digital Illumination Interface Alliance documentation, specifications, FAQs, certification guidance, and product/certification directories.
2. Official IEC or standards-body material where the applicable standard scope can be verified without overstating access or certification meaning.
3. Manufacturer technical documentation only for clearly identified implementation examples; label examples as examples, not universal behavior.
4. Independent technical sources only to explain deployment experience or trade-offs, and only when their claims can be corroborated.

For every material technical claim, record the source title, publisher, publication or revision date, URL, and the exact section/page supporting the claim. Check publication/revision dates immediately before drafting. Do not reproduce normative text at length; explain it in original language and link to the authoritative source.

## SEO and search intent

**Primary intent:** informational and commercial-investigation: the reader wants to understand the difference between DALI-2, D4i, and DALI+ before specifying, purchasing, or approving a lighting-control solution.

**Potential primary query:** `DALI-2 D4i DALI+ diferencias`

**Secondary queries and variants:**

- `qué es DALI-2`
- `qué es D4i`
- `qué es DALI+`
- `DALI-2 vs D4i`
- `D4i iluminación`
- `DALI+ wireless IP`
- `DALI certificado vs compatible`
- `datos de luminaria D4i`

Use the exact comparison intent in the title, introduction, one descriptive heading, table labels, meta description, and FAQ-style questions without keyword stuffing. The search result should promise a practical distinction and project decision criteria, not a generic definition list.

## Internal-link opportunities

These are inferable from the calendar and should be linked only when the related article exists and has a stable published URL:

- **“Una luminaria no termina en los lúmenes: cómo leo una ficha técnica”** (`leer-ficha-tecnica-luminaria`) for checking control, data, and compatibility claims in product sheets.
- **“Iluminación conectada: cuándo aporta valor y cuándo estamos complicando una instalación”** (`iluminacion-conectada-valor`) for the project-value and system-complexity decision.
- **“¿Puede una luminaria convertirse en un nodo de datos del edificio?”** (`luminaria-nodo-datos-edificio`) for D4i data, sensors, and building-data implications.
- **“La iluminación ya no es solo iluminación”** (`iluminacion-no-solo-iluminacion`) as a future pillar link if published first.

Do not create links to unpublished posts merely because their slugs are known; keep a short list of planned cross-links for later editorial integration.

## Risks and claims needing verification

- **Standards drift:** DALI+ terminology, certification rules, and available ecosystem support may evolve before publication.
- **Overlapping labels:** Do not present D4i as a replacement for DALI-2 or DALI+ as simply “DALI over Wi-Fi.” Verify the exact architecture and transport language.
- **Certification ambiguity:** “DALI-2 compatible,” “D4i ready,” and similar marketing phrases may not equal official certification or complete interoperability. Define the evidence required for each claim.
- **Optional versus mandatory features:** Confirm which data sets, memory banks, diagnostics, sensor features, and control capabilities are mandatory, optional, or product-dependent.
- **End-to-end assumptions:** A D4i luminaire does not by itself guarantee external data access, analytics, BMS integration, or useful commissioning. Verify controller, gateway, and software dependencies.
- **Retrofit complexity:** Confirm bus power, wiring, gateway, addressing, commissioning, firmware, and coexistence constraints instead of promising plug-and-play migration.
- **Security and operations:** Research the practical security, network-management, update, and ownership implications of IP/wireless deployments.
- **Product examples:** Date-stamp examples and avoid using a single vendor implementation as a definition of the ecosystem.

## Acceptance checklist

- [ ] The calendar’s first planned post is the article identified by `dali-2-d4i-dali-plus`.
- [ ] The briefing remains a planning and research document; it contains no finished article draft.
- [ ] DALI-2, D4i, and DALI+ are explained as distinct but related concepts, with terminology checked against current primary sources.
- [ ] A comparison table and project decision framework are planned.
- [ ] Research questions cover technical scope, certification, data, infrastructure, commissioning, interoperability, and currentness.
- [ ] Each material claim will have a traceable, dated source before drafting begins.
- [ ] Marketing shorthand and optional features are explicitly treated as verification risks.
- [ ] SEO intent and search variants match professional informational/commercial investigation.
- [ ] Internal links are limited to relevant existing/published content, with planned links deferred when posts are unpublished.
- [ ] The article will not recommend a technology solely because its label is newer.
- [ ] The calendar status for this post is `researching`; no other post status is changed.
- [ ] No final article, publication, push, or commit is part of this work.
