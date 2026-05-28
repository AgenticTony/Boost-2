export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { to, name, verificationUrl } = req.body

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Boost by FCR <noreply@boostbyfcr.se>',
        to,
        subject: 'Verifiera ditt konto - Boost by FCR',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e3a5f;">Välkommen till Boost by FCR!</h2>
            <p>Hej ${name},</p>
            <p>Tack för din registrering. Klicka på länken nedan för att verifiera din e-postadress:</p>
            <p style="margin: 24px 0;">
              <a href="${verificationUrl}" style="background: #e0bd4a; color: #1e3a5f; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Verifiera min e-post
              </a>
            </p>
            <p>Eller kopiera denna länk:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          </div>
        `,
      }),
    })

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}