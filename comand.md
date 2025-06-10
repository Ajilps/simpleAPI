1:
docker build -t my-node-api-server .

2:
docker run -p 3001:3000 -v ./database:/usr/src/app/database -d --name node-api-container my-node-api-server

Command breakdown:
-p 3001:3000: Maps port 3001 on your local machine to port 3000 inside the container. You'll access the API via localhost:3001.
-v ./database:/usr/src/app/database: This is a volume mount. It links the ./database folder on your computer to the /usr/src/app/database folder inside the container. This ensures that the data.db file is saved on your machine and won't be lost if the container is removed.
-d: Runs the container in detached (background) mode.
--name node-api-container: Gives the running container a friendly name.
Step 5: Test Your API
Use curl or a tool like Postman to interact with your API at http://localhost:3001.
POST - Create a new item:
curl -X POST http://localhost:3001/items -H "Content-Type: application/json" -d '{"name": "Laptop", "description": "A powerful development machine"}'
Use code with caution.
Bash
GET - Get all items:
curl http://localhost:3001/items
Use code with caution.
Bash
PUT - Update an item (assuming its ID is 1):
curl -X PUT http://localhost:3001/items/1 -H "Content-Type: application/json" -d '{"description": "A powerful and portable development machine"}'
Use code with caution.
Bash
DELETE - Delete an item (assuming its ID is 1):
curl -X DELETE http://localhost:3001/items/1
Use code with caution.
Bash
How to Stop the Container
When you're finished, you can stop and remove the container with these commands:

# Stop the running container

docker stop node-api-container

# Remove the container (optional)

docker rm node-api-container

Of course. Here is the updated API documentation with all `curl` examples using your specific live Render URL: `https://simpleapi-gayv.onrender.com`.

---

### **API Documentation: Simple Items API**

This document outlines the available endpoints for managing "items" in the database.

**Base URL**

- **Live Server URL**: `https://simpleapi-gayv.onrender.com`

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
