import { useState, useEffect } from "react";
import "./App.css";

function App() {

  // 🔥 API GATEWAY URL
  const API_URL = "https://texhj4uayf.execute-api.eu-north-1.amazonaws.com/dev";

  const [coffeeName, setCoffeeName] = useState("");
  const [price, setPrice] = useState("");
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  // LOAD DATA WHEN PAGE OPENS
  useEffect(() => {
    fetchItems();
  }, []);

  // GET ALL ITEMS
  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_URL}/getAll`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.log(error);
    }
  };

  // EDIT ITEM
  const editItem = (item) => {
    setCoffeeName(item.name);
    setPrice(item.price);
    setEditingId(item.id);
  };

  // UPDATE ITEM
  const updateItem = async () => {
    try {
      const response = await fetch(`${API_URL}/update/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: coffeeName,
          price: price
        })
      });

      if (response.ok) {
        setMessage("Item Updated Successfully ✅");
        setCoffeeName("");
        setPrice("");
        setEditingId(null);
        fetchItems();
      } else {
        setMessage("Error updating item");
      }

    } catch (error) {
      console.log(error);
    }
  };

  // DELETE ITEM
  const deleteItem = async (id) => {
    try {
      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setMessage("Item Deleted Successfully ❌");
        fetchItems();
      } else {
        setMessage("Error deleting item");
      }

    } catch (error) {
      console.log(error);
    }
  };

  // ADD ITEM
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: Date.now().toString(),
        name: coffeeName,
        price: price
      })
    });

    if (response.ok) {
      setMessage("Item Created Successfully ✅");
      setCoffeeName("");
      setPrice("");
      fetchItems();
    } else {
      setMessage("Error creating item");
    }
  };

  return (
    <div className="container">
      <h1>Coffee Shop Management</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Coffee Name"
          value={coffeeName}
          onChange={(e) => setCoffeeName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <br />

        <button
          type="button"
          onClick={editingId ? updateItem : handleSubmit}
        >
          {editingId ? "Update Coffee" : "Add Coffee"}
        </button>

      </form>

      <p>{message}</p>

      <h2>Coffee List</h2>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - ₹{item.price}

            <button
              onClick={() => editItem(item)}
              style={{ marginLeft: "10px", backgroundColor: "orange", color: "white" }}
            >
              Edit
            </button>

            <button
              onClick={() => deleteItem(item.id)}
              style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
            >
              Delete
            </button>

          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;