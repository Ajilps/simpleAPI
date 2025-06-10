const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

// --- Basic Setup ---
const app = express();
// Use the PORT environment variable provided by Render, or 3000 for local development
const PORT = process.env.PORT || 3000;
// Middleware to parse JSON request bodies
app.use(express.json());

// --- Database Connection (Sequelize for PostgreSQL) ---
// The connection string is provided by Render via the DATABASE_URL environment variable.
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false, // Set to true to see SQL queries in logs
  dialectOptions: {
    // This is required for connecting to Render's PostgreSQL databases
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// --- Database Model ---
// This defines the 'Item' table in our database.
const Item = sequelize.define("Item", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    // allowNull defaults to true, so this can be omitted if description is optional
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
    console.error("Error retrieving items:", error);
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
    console.error(`Error retrieving item ${req.params.id}:`, error);
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
    console.error("Error creating item:", error);
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
    console.error(`Error updating item ${req.params.id}:`, error);
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
    console.error(`Error deleting item ${req.params.id}:`, error);
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

    // Sync the model with the database, creating the 'Items' table if it doesn't exist
    await sequelize.sync({ alter: true }); // Using 'alter: true' is safe for development
    console.log("Database models synced successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database or start server:", error);
    // Ensure the process exits if the database connection fails
    process.exit(1);
  }
};

startServer();
