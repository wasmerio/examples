---
title: "Theseus Maze-Solving Machine"
description: "The first machine that demonstrated machine learning capabilities through maze navigation. Built with telephone relay circuits in 1950."
tags:
  - "AI"
  - "Robotics"
  - "Machine Learning"
  - "Hardware"
image: "/images/placeholder.svg"
external_url: "https://en.wikipedia.org/wiki/Theseus_(robot)"
---

## Overview

Theseus was an experimental maze-solving robot I built in 1950 at Bell Labs. It was one of the first examples of a machine that could learn and improve its behavior.

![Theseus mouse demonstration](/images/placeholder.svg)

## Technical Implementation

The system consisted of:

1. **The Mouse**: A small wheeled vehicle containing magnetic sensors
2. **The Maze**: A 5x5 grid with movable walls and hidden pathways  
3. **Control System**: Over 40 telephone relays that stored the learned path
4. **Power System**: Standard electrical power with relay-based logic

### How It Learned

1. **Exploration Phase**: Mouse moves randomly, exploring all paths
2. **Success Detection**: When reaching goal, path is electrically recorded
3. **Memory Storage**: Relays store which moves lead to success
4. **Execution**: Subsequent runs use stored path, ignoring dead ends

The relays used were "sticky" - once energized, they stayed that way until manually reset. This created permanent memory of successful paths.

## Innovations

- **First learning machine**: Demonstrated learning without explicit programming
- **Relay computation**: Pioneering use of telephone equipment for computation
- **Artificial intelligence**: Early AI before the field had a name

## Public Reception

The machine was demonstrated to the press and technical community, generating significant interest. It appeared in:

- Popular Science Monthly
- Scientific American
- Various news outlets

## Legacy

Theseus demonstrated that:
1. Machines can exhibit intelligent behavior
2. Learning can be implemented in hardware
3. Intelligence isn't exclusively biological

The principles influenced later work in AI, robotics, and reinforcement learning.

---

*Theseus proved that with the right circuits, machines could learn.*