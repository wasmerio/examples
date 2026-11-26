# Contact Form Setup

The contact form is located in `src/components/contact/ContactForm.astro`.

## Static Site Integration (Recommended)

### 1. Formspree (Recommended for Static Sites)

1. Register at [formspree.io](https://formspree.io)
2. Create a new form and get your form endpoint
3. Update the form action in `ContactForm.astro`:

```astro
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST"></form>
```

4. Remove the JavaScript demo handler
5. Free tier: 50 submissions/month

### 2. Netlify Forms

1. Deploy your site to Netlify
2. Add `netlify` attribute to the form:

```astro
<form netlify method="POST">
  <!-- Hidden field for bot protection -->
  <input type="hidden" name="form-name" value="contact" />
  <!-- rest of form -->
</form>
```

Free tier: 100 submissions/month

### 3. EmailJS (Client-side)

1. Register at [emailjs.com](https://emailjs.com)
2. Install EmailJS SDK
3. Replace form JavaScript with EmailJS integration

## Server-Side Integration

### Enable SSR

Update `astro.config.mjs`:

```javascript
import { defineConfig } from "astro/config";
import node from "@astrojs/node";

export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  // ... other config options
});
```

### Form Handling

The contact page already includes server-side handling:

- Server-side validation
- JSON data storage
- Custom email integration
- Database storage options

```astro
---
// Form processing logic
if (Astro.request.method === "POST") {
  // Handle form submission
  // Send email, save to database, etc.
}
---
```

## Customization

### Form Fields

Add new fields in `ContactForm.astro`:

```astro
<div class="form-control">
  <label class="label" for="company">
    <span class="label-text">Company</span>
  </label>
  <input
    type="text"
    id="company"
    name="company"
    class="input input-bordered w-full ..."
  />
</div>
```

### Validation

Client-side validation is built-in with HTML5 attributes:

- `required` - Required fields
- `minlength` - Minimum length
- `type="email"` - Email validation

Server-side validation is in the contact page handler.

### Styling

The form uses DaisyUI classes:

- `form-control` - Form field wrapper
- `label` - Field labels
- `input` - Text inputs
- `textarea` - Text areas
- `btn` - Buttons
