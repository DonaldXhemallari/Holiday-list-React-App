// Import the useState hook from React
import { useState } from "react";

// Import the Logo component from "./Logo"
import { Logo } from "./Logo";

// Initial items for demonstration
const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: true },
];

// Main App component
export default function App() {
  // State for managing items in the list
  const [items, setItems] = useState([]);

  // Function to add items to the list
  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  // Function to delete an item from the list
  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  // Function to toggle the "packed" status of an item
  function handleToggleItems(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  // Function to clear the entire list
  function handleClearList() {
    const confirmed = window.confirm(
      "Are you sure you want to clear all the items?"
    );
    if (confirmed) setItems([]);
  }

  // JSX structure for the main App component
  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItems={handleDeleteItem}
        onToggleItem={handleToggleItems}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}

// Form component for adding new items
function Form({ onAddItems }) {
  // State for managing input values
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Function to handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;
    const newItem = { description, quantity, id: Date.now(), packed: false };
    onAddItems(newItem);
    setDescription("");
    setQuantity(1);
  }

  // JSX structure for the Form component
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your 😍trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {/* Generate options for quantity */}
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>ADD</button>
    </form>
  );
}

// PackingList component for displaying and managing the list of items
function PackingList({ items, onDeleteItems, onToggleItem, onClearList }) {
  // State for sorting order
  const [sortBy, setSortby] = useState("input");
  let sortedItem;

  // Sort items based on the selected sorting order
  if (sortBy === "input") sortedItem = items;
  if (sortBy === "description")
    sortedItem = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "packed")
    sortedItem = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  // JSX structure for the PackingList component
  return (
    <div className="list">
      <ul>
        {/* Map through sorted items and render each as an Item component */}
        {sortedItem.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItems={onDeleteItems}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>

      {/* Sorting and clearing actions */}
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortby(e.target.value)}>
          <option value="input">Sort by input Order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={onClearList}>Clear List</button>
      </div>
    </div>
  );
}

// Item component representing an individual item in the list
function Item({ item, onDeleteItems, onToggleItem }) {
  // JSX structure for each Item component
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => {
          onToggleItem(item.id);
        }}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItems(item.id)}>❌</button>
    </li>
  );
}

// Stats component displaying statistics about the list
function Stats({ items }) {
  // If there are no items, display a message to start adding items
  if (!items.length)
    return <p className="stats">Start adding items to your list!</p>;

  // Calculate and display statistics about the list
  const numItem = items.length;
  const packedItem = items.filter((item) => item.packed).length;
  const percentage = Math.round((packedItem / numItem) * 100);

  // JSX structure for the Stats component
  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "Everything is ready"
          : `You have ${numItem} items on your list, and you have packed ${packedItem} (${percentage}%)`}
      </em>
    </footer>
  );
}
//
