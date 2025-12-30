// api/contact.js — version debug
module.exports = async (req, res) => {
  // CORS pour tests (plus tard, on mettra ton domaine précis)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 1) affiche dans les logs ce qui arrive (utile pour Vercel logs)
    console.log('Headers:', req.headers);
    console.log('Raw body (req.body):', req.body);

    // 2) si req.body est vide, essaye de lire le flux brut (au cas où)
    let raw = req.body;
    if (!raw || (typeof raw === 'object' && Object.keys(raw).length === 0)) {
      // essayer de lire le corps brut
      raw = await new Promise((resolve) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(data));
        req.on('error', () => resolve(''));
      });
      console.log('Raw text body:', raw);
      // si c'est du JSON en string, tente de parser
      try { raw = raw ? JSON.parse(raw) : {}; } catch (e) { /* reste en string */ }
    }

    // 3) renvoyer ce qu'on a reçu pour vérification
    return res.status(200).json({
      ok: true,
      receivedType: typeof raw,
      received: raw
    });
  } catch (err) {
    console.error('Debug handler error:', err);
    return res.status(500).json({ error: 'Erreur serveur debug' });
  }
};