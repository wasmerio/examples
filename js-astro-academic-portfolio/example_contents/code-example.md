---
title: "Code Example with Syntax Highlighting"
date: "2026-04-27"
description: "Demonstrating code blocks with syntax highlighting in your posts."
author: "Your Name"
tags:
  - "Code"
  - "Tutorial"
---

# Code Blocks in Posts

This template supports syntax highlighting for code blocks. Here are examples in various languages:

## Python Example

```python
def fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence up to n terms."""
    if n <= 0:
        return []
    
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    
    return sequence[:n]

# Example usage
result = fibonacci(10)
print(f"Fibonacci(10): {result}")
```

## JavaScript Example

```javascript
// Async function to fetch data
async function fetchData(url) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return { success: true, data };
        
    } catch (error) {
        console.error('Fetch error:', error);
        return { success: false, error: error.message };
    }
}

// Usage
const result = await fetchData('https://api.example.com/data');
console.log(result);
```

## TypeScript Example

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
}

function createUser(name: string, email: string): User {
    return {
        id: Date.now(),
        name,
        email,
        isActive: true,
    };
}

const newUser = createUser('John Doe', 'john@example.com');
console.log(newUser);
```

## Bash/Shell Example

```bash
#!/bin/bash

# Build and deploy script
echo "Building project..."
npm run build

echo "Deploying to production..."
rsync -avz --delete dist/ user@server:/var/www/html/

echo "Deployment complete!"
```

## SQL Example

```sql
SELECT 
    u.name,
    COUNT(p.id) as post_count,
    MAX(p.created_at) as latest_post
FROM users u
LEFT JOIN posts p ON u.id = p.author_id
WHERE u.is_active = true
GROUP BY u.id, u.name
HAVING COUNT(p.id) > 5
ORDER BY post_count DESC
LIMIT 10;
```

## CSS Example

```css
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    padding: 1rem;
}

.card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 1.5rem;
    transition: transform 0.2s ease;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
```

## Math in Code Comments

You can also include mathematical expressions in code comments:

```python
def calculate_entropy(probabilities: list[float]) -> float:
    """
    Calculate Shannon entropy.
    
    Formula: H = -Σ p(x) * log₂(p(x))
    
    Args:
        probabilities: List of probability values
    
    Returns:
        Entropy in bits
    """
    return -sum(p * math.log2(p) for p in probabilities if p > 0)
```

---

*Use code blocks to share algorithms, snippets, and technical examples with your readers.*