const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

// --- Basic Setup ---
const app = express();
const PORT = 3000;
app.use(express.json()); // Middleware to parse JSON request bodies

// --- Database Connection (Sequelize) ---
// We will store the database file in the 'database' sub-directory
const dbPath = path.join(__dirname, "database/data.db");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: false, // Set to console.log to see SQL queries
});

// --- Database Model ---
// This defines an 'Item' table with name and description columns.
const Item = sequelize.define("Item", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
});

// --- API Endpoints ---

// A simple welcome message for the root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Node.js, Express, and Sequelize API!" });
});

// GET all items
app.get("/items", async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve items" });
  }
});

// GET a single item by ID
app.get("/items/:id", async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the item" });
  }
});

// POST (create) a new item
app.post("/items", async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'The "name" field is required.' });
    }
    const newItem = await Item.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to create the item" });
  }
});

// PUT (update) an existing item
app.put("/items/:id", async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (item) {
      await item.update(req.body);
      res.json(item);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update the item" });
  }
});

// DELETE an item
app.delete("/items/:id", async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (item) {
      await item.destroy();
      res
        .status(200)
        .json({
          message: `Item with id ${req.params.id} deleted successfully.`,
        });
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the item" });
  }
});

// --- Start Server ---
// We use an async function to ensure the database is synced before the server starts.
const startServer = async () => {
  try {
    // This creates the table if it doesn't exist
    await sequelize.sync();
    console.log("Database synced successfully.");

    // The '0.0.0.0' host is crucial for Docker to map the port correctly
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
