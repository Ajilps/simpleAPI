const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

// --- Basic Setup ---
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// --- Database Connection (Sequelize for PostgreSQL) ---
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    },
  },
});

// --- Database Model (with Validation) ---
const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Name field cannot be empty." },
    }
  },
  rollNumber:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  className:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumber:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageUrl:{
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      // isUrl is a built-in validator, but it's very strict.
      // A custom validator might be better if you allow non-standard URLs.
      isUrl: { msg: "Image URL must be a valid URL format." }
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

// --- API Endpoints ---

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
    // Destructure to prevent mass assignment vulnerability
    const { name, description, rollNumber, className, phoneNumber, imageUrl } = req.body;
    const newItem = await Item.create({ name, description, rollNumber, className, phoneNumber, imageUrl });
    res.status(201).json(newItem);
  } catch (error) {
    // Catch validation errors from the model
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ errors: messages });
    }
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Failed to create the item" });
  }
});

// PUT (update) an existing item
app.put("/items/:id", async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (item) {
      // Destructure to prevent mass assignment vulnerability
      const { name, description, rollNumber, className, phoneNumber, imageUrl } = req.body;
      const updatedData = { name, description, rollNumber, className, phoneNumber, imageUrl };

      await item.update(updatedData);
      res.json(item);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    // Catch validation errors from the model
    if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message);
        return res.status(400).json({ errors: messages });
    }
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
      // Using 204 No Content is a common, good practice for DELETE
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    console.error(`Error deleting item ${req.params.id}:`, error);
    res.status(500).json({ error: "Failed to delete the item" });
  }
});

// --- Start Server ---
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // IMPORTANT: sync() is great for development. For production, use migrations.
    await sequelize.sync({ alter: true });
    console.log("Database models synced successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database or start server:", error);
    process.exit(1);
  }
};

startServer();