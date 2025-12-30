const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json({ ok: true, message: 'Contact function alive (GET)' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !subject || !message) return res.status(400).json({ error: 'Champs manquants (name, email, subject, message)' });

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.CONTACT_TO) {
    console.error('SMTP variables manquantes');
    return res.status(500).json({ error: 'SMTP non configuré' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE) === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    const mail = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_TO,
      subject: `[Site Contact] ${subject}`,
      text: `Nom: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Nom:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`
    };

    await transporter.sendMail(mail);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erreur envoi mail:', err);
    return res.status(500).json({ error: "Échec de l'envoi du mail" });
  }
};