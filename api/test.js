export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Test environment variables and system info
  res.status(200).json({
    message: 'API Test Endpoint',
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGO_URI,
      mongoUri: process.env.MONGO_URI ? 
        process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 
        'NOT SET',
    },
    timestamp: new Date().toISOString(),
    method: req.method
  });
}
