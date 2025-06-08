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