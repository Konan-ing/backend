// api/contact.js — handler de debug minimal
module.exports = async (req, res) => {
  // CORS (pour test). En prod mets ton domaine à la place de '*'
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // on renvoie toujours OK et on affiche la méthode reçue
  return res.status(200).json({
    ok: true,
    message: 'Contact function alive (debug)',
    method: req.method
  });
};