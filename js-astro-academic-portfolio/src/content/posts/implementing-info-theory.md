---
title: "Implementing Information Theory in Python"
date: "1956-06-01"
description: "A practical guide to implementing entropy calculation and data compression using Python."
author: "Claude Shannon"
tags:
  - "Information Theory"
  - "Python"
  - "Programming"
  - "Compression"
---

# Implementing Information Theory in Python

In this post, I'll walk through implementing the core concepts of information theory in Python code.

## Calculating Entropy

The fundamental concept is entropy - the measure of uncertainty in a message:

```python
import math
from collections import Counter

def calculate_entropy(text: str) -> float:
    """
    Calculate the Shannon entropy of a text.
    H = -Σ p(x) log₂ p(x)
    """
    # Count frequency of each character
    freq = Counter(text)
    
    # Calculate probabilities
    total = len(text)
    probabilities = [count / total for count in freq.values()]
    
    # Calculate entropy
    entropy = -sum(p * math.log2(p) for p in probabilities if p > 0)
    
    return entropy

# Example usage
text = "this is a test message"
entropy = calculate_entropy(text)
print(f"Entropy: {entropy:.4f} bits per character")
```

## Source Coding (Huffman Algorithm)

Here's an implementation of Huffman coding for compression:

```python
import heapq
from dataclasses import dataclass, field
from typing import Dict

@dataclass(order=True)
class HuffmanNode:
    freq: int
    char: str = field(compare=False)
    left: 'HuffmanNode' = field(compare=False, default=None)
    right: 'HuffmanNode' = field(compare=False, default=None)

def build_huffman_tree(text: str) -> HuffmanNode:
    """Build Huffman tree from text."""
    freq = Counter(text)
    
    # Create priority queue
    heap = [HuffmanNode(freq=freq[char], char=char) for char in freq]
    heapq.heapify(heap)
    
    # Build tree
    while len(heap) > 1:
        left = heapq.heappop(heap)
        right = heapq.heappop(heap)
        merged = HuffmanNode(
            freq=left.freq + right.freq,
            char='',
            left=left,
            right=right
        )
        heapq.heappush(heap, merged)
    
    return heap[0]

def encode_huffman(root: HuffmanNode, text: str) -> tuple[Dict[str, str], str]:
    """Generate Huffman codes and encode text."""
    codes = {}
    
    def generate_codes(node: HuffmanNode, code: str = ""):
        if node.char:
            codes[node.char] = code or "0"
        else:
            if node.left:
                generate_codes(node.left, code + "0")
            if node.right:
                generate_codes(node.right, code + "1")
    
    generate_codes(root)
    
    # Encode text
    encoded = "".join(codes[char] for char in text)
    return codes, encoded

# Example usage
text = "hello world"
tree = build_huffman_tree(text)
codes, encoded = encode_huffman(tree, text)

print(f"Original: {text}")
print(f"Codes: {codes}")
print(f"Encoded: {encoded}")
print(f"Compression ratio: {len(encoded) / (len(text) * 8):.2%}")
```

## Channel Capacity Calculation

Calculate the capacity of a communication channel:

```python
def channel_capacity(bandwidth: float, snr: float) -> float:
    """
    Calculate channel capacity using Shannon-Hartley theorem.
    C = B × log₂(1 + S/N)
    
    Args:
        bandwidth: Bandwidth in Hz
        snr: Signal-to-noise ratio (not in dB)
    """
    return bandwidth * math.log2(1 + snr)

# Example: Telephone line
bandwidth = 3000  # 3 kHz (typical telephone)
snr_db = 30  # 30 dB
snr = 10 ** (snr_db / 10)  # Convert dB to ratio

capacity = channel_capacity(bandwidth, snr)
print(f"Channel Capacity: {capacity:.0f} bits per second")

# For different SNR values
for db in [10, 20, 30, 40, 50]:
    snr = 10 ** (db / 10)
    cap = channel_capacity(3000, snr)
    print(f"SNR={db}dB: {cap:.0f} bps")
```

## Running the Examples

To run these examples:

```bash
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies (none required for basic version)
pip install -r requirements.txt

# Run examples
python entropy_example.py
python huffman_example.py
python channel_capacity.py
```

## Conclusion

These implementations demonstrate the practical application of information theory concepts. The same principles underlie:

- **Data compression** (ZIP, JPEG, MP3)
- **Error correction** (turbo codes, LDPC)
- **Network protocols** (TCP/IP efficiency)

---

*Information theory provides the mathematical foundation for all modern digital communication.*