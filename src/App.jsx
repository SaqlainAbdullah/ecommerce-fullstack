import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [productIdOfUpdate, setProductIdOfUpdate] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        // Ensure we always set an array, even if API returns something else
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          console.warn('API returned non-array data:', res.data);
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        // Keep products as empty array on error
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleDescChange = (e) => {
    setDescription(e.target.value);
  };
  const handleImageURLChange = (e) => {
    setImageURL(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProduct = {
        id: (Array.isArray(products) ? products.length : 0) + 1,
        title: title,
        description: description,
        imageURL: imageURL,
      };
      await axios.post("/api/products", newProduct);

      setProducts([...products, newProduct]);
      
      // Reset form fields
      setTitle("");
      setDescription("");
      setImageURL("");
      
      alert("Product added successfully!");
    } catch (err) {
      console.log(err);
      alert("Error adding product. Please try again.");
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log(productIdOfUpdate);
      const updatedData = {
        title: title,
        description: description,
        imageURL: imageURL,
      };
      await axios.put(
        `/api/products/${productIdOfUpdate}`,
        updatedData
      );

      // Update the local products state
      if (Array.isArray(products)) {
        const updatedProducts = products.map(product => 
          product.id === productIdOfUpdate 
            ? { ...product, ...updatedData }
            : product
        );
        setProducts(updatedProducts);
      }
      
      // Reset form fields and product ID
      setTitle("");
      setDescription("");
      setImageURL("");
      setProductIdOfUpdate(0);
      
      alert("Product updated successfully!");
    } catch (err) {
      console.log(err);
      alert("Error updating product. Please try again.");
    }
  };

  async function deleteProduct(id) {
    try {
      await axios.delete(`/api/products/${id}`);

      if (Array.isArray(products)) {
        const updateProducts = products.filter((pr) => pr.id != id);
        setProducts(updateProducts);
      }
      alert("Product deleted successfully!");
    } catch (err) {
      alert("Error deleting product. Please try again.");
      console.log(err);
    }
  }

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="app-header">
        <h1 className="app-title">Modern Store</h1>
        <p className="app-subtitle">Manage your products with style</p>
      </header>

      {/* Forms Section */}
      <section className="forms-container">
        {/* Add Product Form */}
        <div className="form-card">
          <h2 className="form-title">Add New Product</h2>
          <form onSubmit={handleSubmit}>
            <div className="modern-form-group">
              <label className="modern-form-label">Product Title</label>
              <input
                type="text"
                className="modern-form-control"
                placeholder="Enter product title"
                value={title}
                onChange={handleTitleChange}
                required
              />
            </div>
            
            <div className="modern-form-group">
              <label className="modern-form-label">Image URL</label>
              <input
                type="url"
                className="modern-form-control"
                placeholder="https://example.com/image.jpg"
                value={imageURL}
                onChange={handleImageURLChange}
                required
              />
            </div>
            
            <div className="modern-form-group">
              <label className="modern-form-label">Description</label>
              <textarea
                className="modern-form-control modern-textarea"
                placeholder="Describe your product..."
                value={description}
                onChange={handleDescChange}
                required
              />
            </div>

            <button type="submit" className="modern-btn btn-primary">
              Add Product
            </button>
          </form>
        </div>

        {/* Update Product Form */}
        <div className="form-card">
          <h2 className="form-title">Update Product</h2>
          {productIdOfUpdate > 0 && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: 'var(--space-lg)',
              border: '1px solid var(--border-color)'
            }}>
              <small style={{ color: 'var(--text-secondary)' }}>
                Updating product ID: {productIdOfUpdate}
              </small>
            </div>
          )}
          <form onSubmit={handleUpdate}>
            <div className="modern-form-group">
              <label className="modern-form-label">Product Title</label>
              <input
                type="text"
                className="modern-form-control"
                placeholder="Enter product title"
                value={title}
                onChange={handleTitleChange}
                required
              />
            </div>
            
            <div className="modern-form-group">
              <label className="modern-form-label">Image URL</label>
              <input
                type="url"
                className="modern-form-control"
                placeholder="https://example.com/image.jpg"
                value={imageURL}
                onChange={handleImageURLChange}
                required
              />
            </div>
            
            <div className="modern-form-group">
              <label className="modern-form-label">Description</label>
              <textarea
                className="modern-form-control modern-textarea"
                placeholder="Describe your product..."
                value={description}
                onChange={handleDescChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="modern-btn btn-primary"
              disabled={productIdOfUpdate === 0}
            >
              Update Product
            </button>
          </form>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="products-header">
          <h2>Product Catalog</h2>
          <p>Manage your product inventory</p>
        </div>
        
        <div className="products-grid">
          {!Array.isArray(products) || products.length === 0 ? (
            <div className="loading">
              No products available. Add your first product above!
            </div>
          ) : (
            products.map((pr) => (
              <article key={pr.id} className="product-card">
                <div className="product-image-container">
                  <img 
                    className="product-image" 
                    src={pr.imageUrl || pr.imageURL} 
                    alt={pr.name || pr.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x240?text=No+Image';
                    }}
                  />
                </div>
                
                <div className="product-content">
                  <h3 className="product-title">{pr.name || pr.title}</h3>
                  <p className="product-description">{pr.desc || pr.description}</p>
                  
                  <div className="product-actions">
                    <button
                      className="modern-btn btn-secondary"
                      onClick={() => {
                        setProductIdOfUpdate(pr.id);
                        setTitle(pr.name || pr.title);
                        setDescription(pr.desc || pr.description);
                        setImageURL(pr.imageUrl || pr.imageURL);
                      }}
                    >
                      Edit
                    </button>
                    
                    <button 
                      className="modern-btn btn-danger"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this product?')) {
                          deleteProduct(pr.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
