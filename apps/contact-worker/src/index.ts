import { Resend } from 'resend';

export interface Env {
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  RESEND_TO_EMAIL: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json() as any;
      const { name, email, subject, message } = body;

      if (!name || !email || !subject || !message) {
        return new Response(JSON.stringify({ error: 'All fields required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const resend = new Resend(env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: env.RESEND_TO_EMAIL,
        replyTo: email,
        subject: `[Kontakt] ${subject}`,
        html: `<p><strong>Från:</strong> ${name} (${email})</p><p><strong>Meddelande:</strong></p><p>${message}</p>`,
        text: `Från: ${name} (${email})\nMeddelande:\n${message}`,
      });

      if (error) {
        console.error('Resend error:', error);
        return new Response(JSON.stringify({ error: 'Email failed', details: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, id: data?.id }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Worker error:', err);
      return new Response(JSON.stringify({ error: 'Server error', details: String(err) }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};