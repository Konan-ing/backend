// Vercel serverless function - /api/azure-proxy.js
// POST { projectId, data }
// Pour chaque projectId, définis AZURE_PROJ_<projectId> et optionnellement AZURE_KEY_<projectId> dans les env vars

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Remplace '*' par ton domaine en prod
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  try {
    const { projectId, data } = req.body || {};
    if (!projectId) return res.status(400).json({ error: 'projectId manquant' });

    const url = process.env[`AZURE_PROJ_${projectId}`];
    const key = process.env[`AZURE_KEY_${projectId}`];
    if (!url) return res.status(400).json({ error: 'Configuration Azure introuvable pour ce projectId' });

    const headers = { 'Content-Type': 'application/json' };
    if (key) headers['Authorization'] = `Bearer ${key}`;

    // forward the request to Azure
    const r = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ data })
    });

    const text = await r.text();
    try {
      const json = JSON.parse(text);
      return res.status(r.status).json(json);
    } catch {
      return res.status(r.status).send(text);
    }
  } catch (err) {
    console.error('azure-proxy error:', err);
    return res.status(500).json({ error: 'Erreur serveur lors du proxy vers Azure' });
  }
};