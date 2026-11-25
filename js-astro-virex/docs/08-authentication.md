# Authentication Pages

This theme includes pre-built Login and Register pages with form validation, social authentication buttons, and demo mode support.

## Available Pages

| Route | File | Description |
|-------|------|-------------|
| `/login` | `login.astro` | User login page |
| `/register` | `register.astro` | User registration page |
| `/forgot-password` | `forgot-password.astro` | Password reset request page |

## Page Structure

### Login Page

The login page (`src/pages/login.astro`) includes:

- Heading: "Welcome back"
- Description: "Sign in to your account to continue"
- Email and password fields
- "Remember me" checkbox
- "Forgot password?" link
- Social login buttons (Google, GitHub)
- Link to register page

### Register Page

The register page (`src/pages/register.astro`) includes:

- Heading: "Create your account"
- Description: "Start your free trial today"
- Full name, email, and password fields
- Terms of Service and Privacy Policy agreement checkbox
- Social signup buttons (Google, GitHub)
- Link to login page

### Forgot Password Page

The forgot password page (`src/pages/forgot-password.astro`) includes:

- Icon and heading: "Forgot your password?"
- Description: "No worries, we'll send you reset instructions."
- Email input field
- "Send reset link" button
- Back to login link

## Components

### LoginForm

Location: `src/components/forms/LoginForm.astro`

```astro
---
import LoginForm from '@forms/LoginForm.astro';
---

<!-- Demo mode (no backend) -->
<LoginForm />

<!-- With custom endpoint -->
<LoginForm 
  action="https://api.example.com/login" 
  method="POST"
  redirectUrl="/dashboard"
/>

<!-- Netlify Identity -->
<LoginForm netlify />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `action` | `string` | `''` | Form action URL. Empty for demo mode |
| `method` | `'POST' \| 'GET'` | `'POST'` | HTTP method |
| `netlify` | `boolean` | `false` | Enable Netlify Identity |
| `redirectUrl` | `string` | `'/'` | Redirect URL after success |

### RegisterForm

Location: `src/components/forms/RegisterForm.astro`

```astro
---
import RegisterForm from '@forms/RegisterForm.astro';
---

<!-- Demo mode (no backend) -->
<RegisterForm />

<!-- With custom endpoint -->
<RegisterForm 
  action="https://api.example.com/register" 
  method="POST"
  redirectUrl="/welcome"
/>

<!-- Netlify Identity -->
<RegisterForm netlify />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `action` | `string` | `''` | Form action URL. Empty for demo mode |
| `method` | `'POST' \| 'GET'` | `'POST'` | HTTP method |
| `netlify` | `boolean` | `false` | Enable Netlify Identity |
| `redirectUrl` | `string` | `'/'` | Redirect URL after success |

### ForgotPasswordForm

Location: `src/components/forms/ForgotPasswordForm.astro`

```astro
---
import ForgotPasswordForm from '@forms/ForgotPasswordForm.astro';
---

<!-- Demo mode (no backend) -->
<ForgotPasswordForm />

<!-- With custom endpoint -->
<ForgotPasswordForm action="https://api.example.com/forgot-password" />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `action` | `string` | `''` | Form action URL. Empty for demo mode |
| `method` | `'POST' \| 'GET'` | `'POST'` | HTTP method |

### SocialAuthButtons

Location: `src/components/forms/SocialAuthButtons.astro`

```astro
---
import SocialAuthButtons from '@forms/SocialAuthButtons.astro';
---

<!-- Login variant -->
<SocialAuthButtons 
  dividerText="Or continue with" 
  variant="login"
  googleUrl="/auth/google"
  githubUrl="/auth/github"
/>

<!-- Register variant -->
<SocialAuthButtons 
  dividerText="Or sign up with" 
  variant="register"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dividerText` | `string` | `'Or continue with'` | Text in divider |
| `variant` | `'login' \| 'register'` | `'login'` | Button text variant |
| `googleUrl` | `string` | `'#'` | Google OAuth URL |
| `githubUrl` | `string` | `'#'` | GitHub OAuth URL |

## Form Validation

Both forms include client-side validation with the following rules:

### Login Form

| Field | Rules |
|-------|-------|
| Email | Required, valid email format |
| Password | Required |

### Register Form

| Field | Rules |
|-------|-------|
| Full name | Required, minimum 2 characters |
| Email | Required, valid email format |
| Password | Required, minimum 8 characters |
| Terms agreement | Required (must be checked) |

### Forgot Password Form

| Field | Rules |
|-------|-------|
| Email | Required, valid email format |

### Validation Behavior

- Fields are validated on blur (when user leaves the field)
- All fields are validated on form submit
- Error messages appear below each field
- Errors clear when user corrects the input
- First invalid field is focused on submit

## Demo Mode

By default, forms run in demo mode when no `action` URL is provided:

1. User fills out the form
2. Form validates input
3. Shows loading state for 1.5 seconds
4. Displays success message
5. Redirects to `redirectUrl`

This allows you to test the UI without backend configuration.

## Backend Integration

### Netlify Identity

```astro
<LoginForm netlify />
<RegisterForm netlify />
```

For full Netlify Identity integration, you'll also need to:

1. Enable Identity in your Netlify dashboard
2. Add the Netlify Identity widget script
3. Configure identity settings

See [Netlify Identity docs](https://docs.netlify.com/visitor-access/identity/) for details.

### Supabase

```astro
<LoginForm action="/api/auth/login" />
<RegisterForm action="/api/auth/register" />
```

Create API routes to handle Supabase authentication:

```typescript
// src/pages/api/auth/login.ts
import { createClient } from '@supabase/supabase-js';

export async function POST({ request }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  
  const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY
  );
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
  
  return new Response(JSON.stringify({ user: data.user }), {
    status: 200,
  });
}
```

### Custom API

```astro
<LoginForm 
  action="https://api.yoursite.com/auth/login" 
  method="POST"
/>
```

Your API should:

1. Accept form data (email, password, etc.)
2. Return JSON response
3. Return 200 status for success
4. Return 4xx/5xx status for errors

### Environment Variables for Auth

Add to your `.env` file:

```bash
# Supabase
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key

# Or for custom API
AUTH_API_URL=https://api.yoursite.com
AUTH_API_KEY=your-api-key
```

## Dashboard Integration

After successful authentication, users are typically redirected to the dashboard:

```astro
<LoginForm 
  action="/api/auth/login"
  redirectUrl="/dashboard"
/>
```

The dashboard requires authentication middleware to protect routes. See [Dashboard documentation](./07-dashboard.md) for implementation details on:

- Setting up authentication middleware
- Protecting dashboard routes
- Managing user sessions
- Implementing logout functionality

## Customization

### Changing Form Fields

Edit the form components directly:

- `src/components/forms/LoginForm.astro`
- `src/components/forms/RegisterForm.astro`
- `src/components/forms/ForgotPasswordForm.astro`

### Changing Validation Rules

Validation rules are defined in the `<script>` section of each form component. Modify the `validationRules` object:

```typescript
const validationRules = {
  email: (value) => {
    if (!value.trim()) return 'Email is required';
    // Add custom validation
    return null;
  },
  // Add more fields...
};
```

### Adding Validation Utilities

The theme includes reusable validators in `src/lib/validation.ts`:

```typescript
import { required, email, minLength, password, checkbox } from '@/lib/validation';

// Available validators:
required('Field name')      // Required field
email()                     // Email format
minLength(n, 'Field name')  // Minimum length
password(n)                 // Password minimum length (default: 8)
checkbox('Field name')      // Checkbox must be checked
```

### Styling Social Buttons

Edit `src/components/forms/SocialAuthButtons.astro` to:

- Add more providers
- Change button styling
- Modify divider appearance

### Removing Social Auth

Simply remove the `<SocialAuthButtons />` component from the page files.

## Navigation Integration

The header automatically includes:

- "Login" link → `/login`
- "Get Started" button → `/register`

These are configured in `src/config/navigation.ts` and rendered in `src/components/layout/Header.astro`.
