# Base image: use the official Node.js LTS image
FROM node:20.11.0

# Set the working directory in the container
WORKDIR /srv/node/app

# Install nodemon globally for development environment
RUN npm install -g nodemon

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install any dependencies (none in this case)
RUN npm install

# Copy the rest of the application
COPY . .

# Change the owner of the project files to the node user
RUN chown -R node /srv/node/app

# Switch to the node user
USER node

# Expose the debugging port
EXPOSE 9229

# Start the application
CMD ["nodemon", "--inspect=0.0.0.0:9229", "server.js"]
