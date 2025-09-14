import connectToDatabase from '../lib/db.js';
import Product from '../models/Product.js';

export default async function handler(req, res) {
  const { method, query: { id } } = req;
  
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

  // Connect to database
  await connectToDatabase();

  switch (method) {
    case 'GET':
      try {
        const product = await Product.findOne({ id: parseInt(id) });
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
      }
      break;

    case 'PUT':
      try {
        const { name, price, imageUrl, desc, title, description, imageURL } = req.body;
        
        // Handle both backend and frontend field names
        const updateData = {};
        if (name || title) updateData.name = name || title;
        if (price !== undefined) updateData.price = price;
        if (imageUrl || imageURL) updateData.imageUrl = imageUrl || imageURL;
        if (desc || description) updateData.desc = desc || description;

        const updatedProduct = await Product.findOneAndUpdate(
          { id: parseInt(id) }, 
          updateData, 
          { new: true }
        );
        
        if (!updatedProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        res.status(200).json(updatedProduct);
      } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
      }
      break;

    case 'DELETE':
      try {
        const deletedProduct = await Product.findOneAndDelete({ id: parseInt(id) });
        
        if (!deletedProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        res.status(200).json({ message: 'Product deleted successfully' });
      } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
