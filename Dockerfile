FROM node:lts-alpine

# Install a simple http server for our static content
RUN npm install -g http-server

# Folder “app” is the working directory
WORKDIR /app

# Copy “package.json” and “package-lock.json”
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy project files and folders in the working directory
COPY . .

# Build application
RUN npm run build

EXPOSE 8765
CMD [ "http-server", "./dist", "--port", "8765" ]
