 
import { VercelRequest, VercelResponse } from '@vercel/node';

// Backend URL - should be set in environment variables
const BACKEND_URL = process.env.BACKEND_URL || 'https://dubai-city-backend.onrender.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Extract the API path
    const path = req.url?.replace('/api', '') || '';
    const url = `${BACKEND_URL}/api${path}`;

    // Forward the request to the main backend
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
      } as HeadersInit,
      body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to connect to backend', 
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}