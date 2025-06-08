
### **API Documentation: Simple Items API**

This document outlines the available endpoints for managing "items" in the database.

**Base URL**

*   **Live Server URL**: `https://simpleapi-gayv.onrender.com`

**Item Object**

The main resource managed by this API is the `Item` object, which has the following structure:

```json
{
  "id": 1,
  "name": "A Sample Item",
  "description": "This is a description for the item.",
  "createdAt": "2023-10-27T10:30:00.123Z",
  "updatedAt": "2023-10-27T10:30:00.123Z"
}
```

---

### **API Endpoints**

#### 1. Root / Welcome Message

A simple endpoint to confirm that the API is running.

- **Functionality**: Displays a welcome message.
- **Method**: `GET`
- **URL**: `/`
- **Success Response** (Code `200 OK`):
  ```json
  {
    "message": "Welcome to the Node.js, Express, and Sequelize API!"
  }
  ```
- **`curl` Example**:
  ```bash
  curl https://simpleapi-gayv.onrender.com/
  ```

---

#### 2. Get All Items

Retrieves a list of all items currently in the database.

- **Functionality**: Fetches all items.
- **Method**: `GET`
- **URL**: `/items`
- **Success Response** (Code `200 OK`): An array of item objects.
  ```json
  [
    {
      "id": 1,
      "name": "My First Item",
      "description": "Description for the first item.",
      "createdAt": "2023-10-27T10:30:00.123Z",
      "updatedAt": "2023-10-27T10:30:00.123Z"
    },
    {
      "id": 2,
      "name": "My Second Item",
      "description": null,
      "createdAt": "2023-10-27T10:35:15.456Z",
      "updatedAt": "2023-10-27T10:35:15.456Z"
    }
  ]
  ```
- **`curl` Example**:
  ```bash
  curl https://simpleapi-gayv.onrender.com/items
  ```

---

#### 3. Get a Single Item by ID

Retrieves a specific item using its unique ID.

- **Functionality**: Fetches a single item.
- **Method**: `GET`
- **URL**: `/items/:id` (e.g., `/items/1`)
- **Success Response** (Code `200 OK`): A single item object.
  ```json
  {
    "id": 1,
    "name": "My First Item",
    "description": "Description for the first item.",
    "createdAt": "2023-10-27T10:30:00.123Z",
    "updatedAt": "2023-10-27T10:30:00.123Z"
  }
  ```
- **Error Response** (Code `404 Not Found`): `{"error": "Item not found"}`
- **`curl` Example**:
  ```bash
  curl https://simpleapi-gayv.onrender.com/items/1
  ```

---

#### 4. Create a New Item

Adds a new item to the database.

- **Functionality**: Creates a new item.
- **Method**: `POST`
- **URL**: `/items`
- **Request Body** (JSON):
  - `name` (string, **required**)
  - `description` (string, _optional_)
- **Success Response** (Code `201 Created`): The newly created item object.
  ```json
  {
    "id": 3,
    "name": "A New Item",
    "description": "This was just created.",
    "updatedAt": "2023-10-27T11:00:00.000Z",
    "createdAt": "2023-10-27T11:00:00.000Z"
  }
  ```
- **Error Response** (Code `400 Bad Request`): `{"error": "The \"name\" field is required."}`
- **`curl` Example**:
  ```bash
  curl -X POST https://simpleapi-gayv.onrender.com/items \
       -H "Content-Type: application/json" \
       -d '{"name": "A New Item", "description": "This was just created."}'
  ```

---

#### 5. Update an Existing Item

Modifies the data of an existing item.

- **Functionality**: Updates an item by its ID.
- **Method**: `PUT`
- **URL**: `/items/:id` (e.g., `/items/3`)
- **Request Body** (JSON): One or both optional properties.
  - `name` (string, _optional_)
  - `description` (string, _optional_)
- **Success Response** (Code `200 OK`): The full, updated item object.
  ```json
  {
    "id": 3,
    "name": "An Updated Item Name",
    "description": "The description was updated too.",
    "createdAt": "2023-10-27T11:00:00.000Z",
    "updatedAt": "2023-10-27T11:05:00.000Z"
  }
  ```
- **Error Response** (Code `404 Not Found`): `{"error": "Item not found"}`
- **`curl` Example**:
  ```bash
  curl -X PUT https://simpleapi-gayv.onrender.com/items/3 \
       -H "Content-Type: application/json" \
       -d '{"name": "An Updated Item Name"}'
  ```

---

#### 6. Delete an Item

Removes an item from the database permanently.

- **Functionality**: Deletes an item by its ID.
- **Method**: `DELETE`
- **URL**: `/items/:id` (e.g., `/items/3`)
- **Success Response** (Code `200 OK`):
  ```json
  {
    "message": "Item with id 3 deleted successfully."
  }
  ```
- **Error Response** (Code `404 Not Found`): `{"error": "Item not found"}`
- **`curl` Example**:
  ```bash
  curl -X DELETE https://simpleapi-gayv.onrender.com/items/3
  ```
