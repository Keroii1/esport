module.exports = async (req, res) => {
  const { path, ...rest } = req.query;
  const ok = ['/lol/', '/tournaments/', '/teams/', '/players/', '/matches/'];
  if (typeof path !== 'string' || path.includes('..') || !ok.some(p => path.startsWith(p))) {
    return res.status(400).json({ error: 'chemin non autorisé' });
  }
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(rest)) qs.append(k, Array.isArray(v) ? v.join(',') : v);
  try {
    const r = await fetch('https://api.pandascore.co' + path + '?' + qs, {
      headers: { Authorization: 'Bearer ' + process.env.PANDASCORE_TOKEN }
    });
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(r.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'erreur serveur' });
  }
};
