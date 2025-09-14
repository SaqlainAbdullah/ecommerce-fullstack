import connectToDatabase from './lib/db.js';
import Product from './models/Product.js';

export default async function handler(req, res) {
  const { method } = req;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Connect to database
    await connectToDatabase();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({ 
      error: 'Database connection failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }

  switch (method) {
    case 'GET':
      try {
        const products = await Product.find();
        res.status(200).json(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ 
          error: 'Failed to fetch products',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
      break;

    case 'POST':
      try {
        const { id, name, price, imageUrl, desc, title, description, imageURL } = req.body;
        
        // Handle both backend and frontend field names
        const productData = {
          id: id || (await Product.countDocuments()) + 1,
          name: name || title,
          price: price || 0,
          imageUrl: imageUrl || imageURL,
          desc: desc || description
        };

        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
      } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ 
          error: 'Failed to create product',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
