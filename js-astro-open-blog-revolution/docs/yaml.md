# **YAML Data Specification — Meta-Schema (YDS-MS)**

### **Version 0.2 — Draft**

---

## **1\. Purpose**

The **YDRS Meta-Schema (YDRS-MS)** defines syntactic and structural rules for YAML data that can be automatically parsed to generate randomized static, immutable objects.

It does **not** constrain what the data describes (for example, a *character*, *building*, or *item*).  

It only defines **how** information is encoded and optionally interpreted (through randomization, references, or expressions).

---

## **2\. Node Types**

All YAML data is composed of **nodes**.  

Each node can be one of three types:

| Node Type | Description |
| ----- | ----- |
| **Scalar** | A single value — string, number, or special form. |
| **Mapping** | A key–value structure; may include labels or nested data. |
| **List** | An ordered collection; may support randomization or count-selection (which defines how many items from the list have have to be randomized). |

Each node type has specific formatting conventions.

---

## **3\. Scalar Nodes**

A **scalar** can represent plain text or an encoded logical form.

### **3.1 Accepted Forms**

| Form | Syntax | Meaning |
| ----- | ----- | ----- |
| **Plain value** | Any string not matching special forms | Literal text (alphanumerical) value. |
| **Range** | `[min-max]` | Random integer between `min` and `max`. |
| **Reference** | `%key` | Reference to another key's resolved value. |
| **Expression** | `{formula}` | Computed value using strings, references or ranges. |

### **3.2 Formal Patterns**

| Type | Regex Pattern | Notes |
| ----- | ----- | ----- |
| Plain | `^[^{\[%].*$` | Default catch-all. |
| Range | `^\[\d+\-\d+\]$` | Numeric range only. |
| Reference | `^%[A-Za-z0-9_]+$` | Refers to a key path. |
| Expression | `^{.*}$` | Evaluated arithmetic or logical expression. |

### **3.3 Expression Grammar (draft)**

Expressions inside `{}` may contain:

* Strings (`This is a string`)

* Numeric literals (`1`, `20`, etc.)

* Random ranges (`[min-max]`)

* References (`%key` or `[%key]`) - TODO update patterns, basically [] means randoomize

* Operators (`+`, `-`, `*`, `/`, `(`, `)`)

Examples:

`bonus: {%FOR + [1-6]/2}`

`description: "A tall tower made of %material."`

`npc: The %adjective ogre.`

---

## **4\. Mapping Nodes**

A **mapping** represents named data.
The data can be of any of the accepted Node Types as defined in 2.: Scalar, Mapping or List.

Optionally a mapping can specify a label for display.

### **4.1 Structure**

Base structure of a mapping is 

`key: data`

Example:

`knight: Alfred`

### **4.2 Optional fields**

A mapping can contain two optional fields: `label` and `data`.
The `label` field allows to display a custom label instead of the `key`.
If a `label` is specified, then the data must be contained in a new mapping with the key `data`.

Example:

| Field | Type | Description |
| ----- | ----- | ----- |
| `label` | string (optional) | Human-readable label or title. |
| `data` | any node | The underlying data node (scalar, list, or mapping). |

### **4.3 Example**

`strength:`  
  `label: "Physical Strength"`  
  `data: [1-20]`

Output → Physical Strength: 17

---

## **5\. List Nodes**

Lists contain a collection of items.
This items can be of any of the accepted Node Types as defined in 2.: Scalar, Mapping or List.

### **5.1 Simple Lists**

`gear:`  
  `- sword`  
  `- shield`  
  `- rope`

By default a single item is randomize from the list.

Output → **Gear:** shield

### **5.2 Optional fields**

Optionally the `count` field (mapping) can specify how many items must be randomized from the list.
When `count` is used the items must be in a submapping associated with the key `data`.
`count: 0` the items are not randomized they're all displayed

`gear:`  
  `count: 3`  
  `data:`  
    `- sword`  
    `- shield`  
    `- torch`  
    `- rope`

Output → Gear: sword, torch, rope

### **5.3 Optional Fields**

| Field | Type | Description |
| ----- | ----- | ----- |
| `count` | integer (optional) | Number of list items to include. |
| `data` | array | Pool of possible values. |

---

## **6\. References**

A value beginning with `%` denotes a **reference** to another node's resolved data.  
 References are resolved *after all base nodes are evaluated*.

`hair:`  
  `- red`  
  `- blue`  
`jacket:`  
  `color: %hair`

Output (assuming `hair = blue`) → Jacket color: blue 

### **6.1 Unresolved references**

The following syntax `[%reference]`triggers a fresh random evaluation of the reference. If it's not randomizable it just recalls the value.
---

---

## **7\. Conditionals**

Node can be conditional. Number expresses a probability in percentages, for the node to be resovled with the data associated too true. 

`key?number:
  true: data
  false: data
`

example:

`
transportByLand?20:
  true: 
    - train
    - car
  false: boat
`
---

## **8\. Evaluation Order**

Parsing is a single-pass, top-down process. A reference %key must point to a key that has already been defined and processed earlier in the document.

If not the parser will return an error default value.
---

## **9\. Parsing Behavior Summary**

| Input Type | Behavior |
| ----- | ----- |
| `scalar` | Interpret special forms (`%`, `[n-m]`, `{}`), else literal. |
| `mapping` | Recursively resolve nested data or labeled node. |
| `list` | Randomize or count-select items from contained data. |

---

## **10\. Example (Domain-Agnostic)**

`building:`  
  `label: "Ancient Tower"`  
  `data:`  
    `height: [30-50]`  
    `material:`  
      `- stone`  
      `- brick`  
      `- obsidian`  
    `architect:`  
      `label: "Master Builder"`  
      `data:`  
        `- Aldren`  
        `- Mira`  
        `- Korath`  
    `cost: {%height * [100-200]}`

Possible output:

`Ancient Tower:`  
  `Height: 46`  
  `Material: obsidian`  
  `Master Builder: Mira`  
  `Cost: 8740`

---

## **11\. Compliance Rules**

A YAML document is **YDRS-compliant** if:

1. Every node conforms to one of the three node types.

2. Every scalar matches a defined scalar form or plain value.

3. Every mapping uses only allowed optional fields (`label`, `data`).

4. Every list is plain or structured as defined.

### **Extension Rules**

* Implementations may add new scalar patterns (e.g. `@function`, `$variable`).

* **Unrecognized nodes are treated as plain values.**

* Evaluation must remain **deterministic per random seed** when reproducibility is required. Needs to be implemented.

---

*(End of YDS-MS Specification, Chapters 1–10)*



# **Generator skeleton draft**

Purpose generate radomize text content using YDRS data.
Gneration rules are embedded within the YDRS data.

## Workflow draft

LoadYAML:: Array of strings -> String
  Load YAML files
  Combine them
  Return YAML string

YAML-js:: String -> Object
  Parse YAML turn it into JSON
  Turn JSON into an Object
  Return Object

dataParse:: Object -> Object
  // Takes raw YAML Object turns it into generated Object 
  Create Store (object)
  parseMap (Object, Store)
  return Object


parseMap:: (Object, Store) -> updatedStore
  turn Object into array [key, value]
  for each [key, value]
    - if it's a Map parseMap([key, value], Store)
    - if it's a Scalar parseScalar([key, value], Store)
    - if it's a List parseList([key, value], Store)
  return updatedStore


parseScalar([key, value], Store):: -> updatedStore
  - plain value -> updateStore(key, plain value)
  - range -> generate randomInteger(range) -> updateStore(key, randomInteger)
  - expression -> evalEpression(expression) -> updateStore(key, evaluatedExpression)
  - reference -> resolveReference(Store) -> updateStore(key, resolvedReference)
  return updatedStore

parseList([key, value], Store):: -> updatedStore