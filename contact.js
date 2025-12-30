// Vercel serverless function - /api/contact.js
// POST { name, email, subject, message }
// Requiert variables d'env : SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, SMTP_FROM

const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Autoriser les requêtes OPTIONS (CORS préflight) si nécessaire
  res.setHeader('Access-Control-Allow-Origin', '*'); // Remplace '*' par ton domaine en prod
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  if (!process.env.SMTP_HOST) {
    return res.status(500).json({ error: 'SMTP non configuré côté serveur' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_TO,
      subject: `[Site CV] ${subject}`,
      text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erreur envoi mail:', err);
    return res.status(500).json({ error: 'Échec de l\'envoi du mail' });
  }
};