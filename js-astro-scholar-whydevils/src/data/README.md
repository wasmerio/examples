# Publications Data Format

This guide explains how to structure your publications in `publications.json`.

## JSON Structure

The file contains an array of publication objects. Each publication should follow this structure:

```json
{
  "id": 1,
  "title": "Your Publication Title",
  "authors": "Author1, Author2, Author3",
  "journal": "Journal Name or Conference Name",
  "year": 2024,
  "link": "https://link-to-paper.com",
  "authorship": "first",
  "abstract": "Full abstract of your publication...",
  "doi": "10.xxxx/xxxxx",
  "publicationType": "Journal"
}
```

## Field Descriptions

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | number | Unique identifier for the publication | `1` |
| `title` | string | Full title of the publication | `"Deep Learning for Scientific Computing"` |
| `authors` | string | Comma-separated list of authors | `"Smith J, Doe A, Johnson B"` |
| `journal` | string | Journal name, conference, or venue | `"Nature Machine Intelligence"` |
| `year` | number | Publication year | `2024` |
| `link` | string | URL to the publication (DOI link, arXiv, etc.) | `"https://doi.org/10.xxxx/xxxxx"` |
| `authorship` | string | Your authorship role | `"first"`, `"last"`, or `"other"` |
| `publicationType` | string | Type of publication | `"Journal"`, `"Conference"`, `"Preprint"`, or `"Thesis"` |

### Optional Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `abstract` | string | Full abstract text | `"In this work, we present..."` |
| `doi` | string | Digital Object Identifier | `"10.1038/s42256-024-00001-1"` |

## Authorship Values

The `authorship` field is used to filter publications by your role:

- **`"first"`** - You are the first author (or equal contribution first author)
- **`"last"`** - You are the last/senior author
- **`"other"`** - You are a middle author or contributor

## Publication Type Values

The `publicationType` field is used to categorize and filter publications:

- **`"Journal"`** - Peer-reviewed journal articles
- **`"Conference"`** - Conference papers and proceedings
- **`"Preprint"`** - Preprints (arXiv, bioRxiv, etc.)
- **`"Thesis"`** - PhD thesis, Master's thesis, etc.

## Examples

### Journal Article (First Author)

```json
{
  "id": 1,
  "title": "Neural Networks for Protein Folding Prediction",
  "authors": "Smith J, Doe A, Johnson B, Williams C",
  "journal": "Nature",
  "year": 2024,
  "link": "https://doi.org/10.1038/s41586-024-12345-6",
  "authorship": "first",
  "abstract": "We present a novel deep learning approach for predicting protein structures with unprecedented accuracy. Our method combines attention mechanisms with physical constraints to achieve state-of-the-art results on benchmark datasets.",
  "doi": "10.1038/s41586-024-12345-6",
  "publicationType": "Journal"
}
```

### Conference Paper (Other Author)

```json
{
  "id": 2,
  "title": "Scalable Inference for Bayesian Networks",
  "authors": "Johnson B, Smith J, Williams C",
  "journal": "NeurIPS 2024",
  "year": 2024,
  "link": "https://proceedings.neurips.cc/paper/2024/hash/abcd1234",
  "authorship": "other",
  "abstract": "This paper introduces a scalable approach to inference in large Bayesian networks using variational methods and distributed computing.",
  "doi": "",
  "publicationType": "Conference"
}
```

### Preprint (Last Author)

```json
{
  "id": 3,
  "title": "Foundation Models for Scientific Discovery",
  "authors": "Williams C, Brown D, Smith J",
  "journal": "arXiv preprint",
  "year": 2024,
  "link": "https://arxiv.org/abs/2401.12345",
  "authorship": "last",
  "abstract": "We explore the application of foundation models to accelerate scientific discovery across multiple domains including biology, chemistry, and materials science.",
  "doi": "10.48550/arXiv.2401.12345",
  "publicationType": "Preprint"
}
```

### PhD Thesis

```json
{
  "id": 4,
  "title": "Machine Learning Methods for Computational Biology",
  "authors": "Smith J",
  "journal": "PhD Thesis, Stanford University",
  "year": 2023,
  "link": "https://purl.stanford.edu/ab123cd4567",
  "authorship": "first",
  "abstract": "This thesis develops novel machine learning methods for analyzing biological data, with applications to genomics, proteomics, and drug discovery.",
  "doi": "",
  "publicationType": "Thesis"
}
```

## Tips for Organizing Publications

### Chronological Order

Publications are typically displayed in reverse chronological order (newest first). The publications page automatically sorts by year, but you may want to order entries within the same year by importance or submission order.

### Author Names

- Use consistent formatting for all author names
- Common formats: "LastName Initial" (e.g., "Smith J") or "LastName, FirstName" (e.g., "Smith, John")
- Separate multiple authors with commas
- For papers with many authors, you can use "et al." if appropriate

### Links

- Use DOI links when available (e.g., `https://doi.org/10.xxxx/xxxxx`)
- For preprints, use arXiv, bioRxiv, or similar permanent links
- For theses, use institutional repository permanent links
- Ensure links start with `https://` or `http://`

### Abstracts

- Keep abstracts concise but informative (typically 150-250 words)
- Avoid special formatting or unusual characters that might break JSON
- Escape quotes inside abstracts using `\"`
- Abstracts are optional but recommended for better discoverability

### IDs

- Use sequential integers starting from 1
- IDs must be unique
- IDs are used internally for rendering; they don't affect display order

## Validation

Before deploying, verify your `publications.json`:

1. **Valid JSON**: Use a JSON validator or your editor's JSON linting
2. **Required fields**: Ensure all publications have all required fields
3. **Authorship values**: Only use "first", "last", or "other"
4. **Publication types**: Only use "Journal", "Conference", "Preprint", or "Thesis"
5. **Links**: Test that all URLs work
6. **Escaping**: Ensure quotes and special characters are properly escaped

## Common Mistakes

- ❌ Missing comma between publication objects
- ❌ Trailing comma after the last publication
- ❌ Unescaped quotes in titles or abstracts
- ❌ Invalid authorship value (e.g., "middle" instead of "other")
- ❌ Invalid publicationType value (e.g., "Paper" instead of "Journal")
- ❌ Missing required fields
- ❌ Duplicate IDs

## Updating Publications

When you publish a new paper:

1. Add it to the beginning or end of the array (your preference)
2. Assign it a unique ID
3. Fill in all required fields
4. Test locally with `npm run dev`
5. Rebuild and deploy: `npm run build`

The publications page will automatically update with filters and sorting.

---

Need help? Check the main [README.md](../../README.md) or review the example publications in this file.
