import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

function App() {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [productIdOfUpdate, setProductIdOfUpdate] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5050/products");
        setProducts(res.data);
      } catch (err) {
        console.log(err);
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
        id: products.length + 1,
        title: title,
        description: description,
        imageURL: imageURL,
      };
      await axios.post("http://localhost:5050/products", newProduct);

      setProducts([...products, newProduct]);
      alert("Saved");
    } catch (err) {
      console.log(err);
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
        `http://localhost:5050/products/${productIdOfUpdate}`,
        updatedData
      );

      alert("Saved");
    } catch (err) {
      console.log(err);
    }
  };

  async function deleteProduct(id) {
    try {
      await axios.delete(`http://localhost:5050/products/${id}`);

      const updateProducts = products.filter((pr) => {
        if (pr.id != id) {
          return pr;
        }
      });
      setProducts(updateProducts);
      alert("Product Removed");
    } catch (err) {
      alert("Something went wrong");
      console.log(err);
    }
  }

  return (
    <>
      <div style={{ display: "flex" }}>
        <div>
          <h2>New Product</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                onChange={handleTitleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Image URL"
                onChange={handleImageURLChange}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={handleDescChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add
            </Button>
          </Form>
        </div>
        <div>
          <h2>Product Update</h2>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                onChange={handleTitleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Image URL"
                onChange={handleImageURLChange}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={handleDescChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {products.map((pr) => {
          return (
            <Card
              style={{
                width: "18rem",
                border: "2px solid black",
                borderRadius: 10,
              }}
            >
              <Card.Img variant="top" src={pr.imageURL} width={200} />
              <Card.Body>
                <Card.Title>{pr.title}</Card.Title>
                <Card.Text>{pr.description}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => setProductIdOfUpdate(pr.id)}
                >
                  Update
                </Button>
                <Button variant="primary" onClick={() => deleteProduct(pr.id)}>
                  Delete
                </Button>
                <Button variant="primary">Add to Cart</Button>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </>
  );
}

export default App;
