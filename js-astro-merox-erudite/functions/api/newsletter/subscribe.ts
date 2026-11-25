// Cloudflare Pages Function - Newsletter Subscription
// This runs as a native Cloudflare Worker, no Astro adapter needed

interface Env {
  BREVO_API_KEY: string
  BREVO_LIST_ID: string
  BREVO_TEMPLATE_ID?: string
  SITE_URL?: string
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get configuration from environment variables
    const brevoApiKey = env.BREVO_API_KEY as string
    const brevoListId = env.BREVO_LIST_ID as string
    const brevoTemplateId = env.BREVO_TEMPLATE_ID || '5'
    const siteUrl = env.SITE_URL || 'https://yourdomain.com'

    if (!brevoApiKey) {
      console.error('BREVO_API_KEY is not configured')
      return new Response(
        JSON.stringify({ error: 'Newsletter service is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const templateId = parseInt(brevoTemplateId, 10)
    const listId = brevoListId ? parseInt(brevoListId, 10) : null

    if (isNaN(templateId)) {
      return new Response(
        JSON.stringify({ error: 'Template ID is required for double opt-in' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!listId || isNaN(listId)) {
      return new Response(
        JSON.stringify({ error: 'List ID is required for double opt-in' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Prepare double opt-in request
    const contactData = {
      email: email.trim().toLowerCase(),
      includeListIds: [listId],
      templateId: templateId,
      redirectionUrl: `${siteUrl}/newsletter/confirmed`,
      updateEnabled: true,
    }

    // Call Brevo double opt-in confirmation endpoint
    const brevoResponse = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify(contactData),
    })

    // Handle responses
    if (!brevoResponse.ok) {
      // Contact already exists - already subscribed
      if (brevoResponse.status === 409) {
        return new Response(
          JSON.stringify({ 
            message: 'You are already subscribed to the newsletter',
            success: true 
          }),
          { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
          }
        )
      }

      // Parse error response
      let brevoData: any = {}
      const contentType = brevoResponse.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        try {
          const text = await brevoResponse.text()
          if (text) {
            brevoData = JSON.parse(text)
          }
        } catch (e) {
          console.error('Failed to parse Brevo error response:', e)
        }
      }

      const errorMessage = brevoData?.message || 'Failed to subscribe to newsletter'
      console.error('Brevo API error:', {
        status: brevoResponse.status,
        statusText: brevoResponse.statusText,
        data: brevoData
      })
      
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { 
          status: brevoResponse.status || 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }

    // Success - Contact added and confirmation email sent
    return new Response(
      JSON.stringify({ 
        message: 'Successfully subscribed! Please check your email to confirm your subscription.',
        success: true 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
}
