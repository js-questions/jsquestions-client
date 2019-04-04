# Load node server
FROM node:10

# Change working dir to /client
WORKDIR /client

# Add files from current to /app
COPY package.json /client/package.json

# Install node packages
RUN npm install

# Add source files
COPY . .

# Run the build
CMD [ "npm", "start" ];

# Expose the port
EXPOSE 3000