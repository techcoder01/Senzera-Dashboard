import axios from 'axios';

export const config = {
  api: {
    bodyParser: false // Disable the default body parser for file uploads
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const formData = new FormData();
    
    // Forward the request to the backend
    const response = await axios.post('http://18.192.10.230:8000/upload', req.body, {
      headers: {
        ...req.headers,
        'Content-Type': 'multipart/form-data',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(error.response?.status || 500).json({
      message: error.message,
      ...(error.response && { data: error.response.data }),
    });
  }
}