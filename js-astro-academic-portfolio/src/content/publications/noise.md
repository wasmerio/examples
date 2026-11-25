---
title: "Communication in the Presence of Noise"
author: "C.E. Shannon"
date: "1949-01-01"
journal: "Proceedings of the IRE, Vol. 37, No. 1, pp. 10-21"
external_url: "https://archive.org/details/shannon-1949-noise"
description: "Extension of information theory to noisy channels, introducing the concept of error-correcting codes and proving it's possible to achieve reliable communication."
tags:
  - "Information Theory"
  - "Noise"
  - "Coding Theory"
---

## Abstract

This paper extends the basic theory to the practical problem of communicating in the presence of noise. It introduces the revolutionary concept that perfect (error-free) communication is possible, given sufficient redundancy in the encoding.

## The Revolutionary Insight

Previously, engineers believed that to reduce errors, you had to reduce transmission rate. I showed that there exists a "channel capacity" - a rate below which you can communicate with arbitrarily small error probability by using sufficiently clever coding.

## Key Results

### Channel Capacity with Noise

For a channel with bandwidth W and signal-to-noise ratio S/N:

$$C = W \log_2(1 + S/N)$$

This is the famous Shannon-Hartley theorem.

### Error Correction Coding

The paper introduced the concept of:
- **Redundant encoding**: Adding extra symbols to detect/correct errors
- **Code distance**: Measuring error-correcting capability
- **Sphere packing**: Geometric interpretation of coding

## Practical Impact

This paper directly led to:
- Turbo codes (used in 3G/4G mobile)
- LDPC codes (used in WiFi, digital TV)
- Reed-Solomon codes (CDs, DVDs, storage)
- All modern error correction

---

*The proof that we could communicate perfectly over imperfect channels changed everything.*