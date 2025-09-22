// Health check endpoint for Vercel serverless functions
module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    message: 'Bulletin AVAX API is running',
    version: '1.0.0',
    endpoints: {
      l1s: '/api/l1s',
      health: '/api'
    }
  });
}