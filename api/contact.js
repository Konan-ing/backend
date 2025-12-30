// api/contact.js — handler debug qui accepte GET et POST
module.exports = async (req, res) => {
  // CORS (pour test). En production, remplace '*' par ton domaine.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      message: 'Contact function alive (GET)'
    });
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (!body || (typeof body === 'object' && Object.keys(body).length === 0)) {
      body = await new Promise((resolve) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(data));
        req.on('error', () => resolve(''));
      });
      try { body = body ? JSON.parse(body) : {}; } catch (e) { /* reste string */ }
    }

    return res.status(200).json({
      ok: true,
      message: 'Contact function received POST',
      received: body
    });
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
};