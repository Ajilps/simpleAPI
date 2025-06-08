const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
// No longer need 'path' for the database
// const path = require('path');

// --- Basic Setup ---
const app = express();
const PORT = process.env.PORT || 3000; // Use Render's port or 3000 for local
app.use(express.json());

// --- Database Connection (Sequelize for PostgreSQL) ---
// The connection string will be provided by Render via the DATABASE_URL environment variable
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Required for Render's internal connections
    },
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
      res.status(200).json({
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
    // Test the database connection
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sync the model with the database
    await sequelize.sync();
    console.log("Database synced successfully.");

    app.listen(PORT, () => {
      // Note: We removed '0.0.0.0' as Render handles this automatically.
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database or start server:", error);
  }
};

startServer();
