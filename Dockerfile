# Use an official Node.js runtime as a parent image.
# 'alpine' is a lightweight version of Linux, great for small images.
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
# Using 'package*.json' to copy both files
COPY package*.json ./

# Install app dependencies
# This is a separate layer, so it's cached unless package.json changes
RUN npm install

# Copy the rest of the application source code
COPY . .

# SQLite needs to write to a file. The default Node user needs permission.
# We create the directory and give the 'node' user ownership.
RUN mkdir -p ./database && chown -R node:node ./database

# The node image has a non-root user 'node' for security. Switch to it.
USER node

# Make port 3000 available to the host
EXPOSE 3000

# Define the command to run your app
CMD [ "npm", "start" ]