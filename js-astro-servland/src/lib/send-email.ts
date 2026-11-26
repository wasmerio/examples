import type { FormData } from '@astrojs/node';

export async function send_email(formData: FormData) {
  // Validate CSRF token
  const csrfToken = formData.get('csrf_token');
  if (!csrfToken) {
    return { error: 'Invalid CSRF token' };
  }

  // Validate reCAPTCHA
  const recaptchaResponse = formData.get('g-recaptcha-response');
  if (!recaptchaResponse) {
    return { error: 'Please complete the reCAPTCHA' };
  }

  const recaptchaVerify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${import.meta.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`
  });

  const recaptchaData = await recaptchaVerify.json();
  if (!recaptchaData.success) {
    return { error: 'Invalid reCAPTCHA' };
  }

  // Validate form data
  const name = formData.get('name')?.toString();
  const email = formData.get('email')?.toString();
  const tel = formData.get('tel')?.toString();
  const message = formData.get('message')?.toString();

  if (!name || !email || !tel || !message) {
    return { error: 'All fields are required' };
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return { error: 'Invalid email address' };
  }

  if (!tel.match(/^[0-9]{10}$/)) {
    return { error: 'Invalid phone number format' };
  }

  try {
    // Send email using your preferred email service
    // Example using EmailJS or similar service:
    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: import.meta.env.EMAILJS_SERVICE_ID,
        template_id: import.meta.env.EMAILJS_TEMPLATE_ID,
        user_id: import.meta.env.EMAILJS_USER_ID,
        template_params: {
          from_name: name,
          from_email: email,
          tel: tel,
          message: message
        }
      })
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { error: 'Failed to send email. Please try again later.' };
  }
}
