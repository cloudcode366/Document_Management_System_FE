# Use the official Node.js image as the base image
FROM node:18-alpine3.20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React application
RUN npm run build

# Use the official Nginx image to serve the React application
FROM nginx:1.27.4-alpine AS production

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the build output to the Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Scripts directory to Nginx html directory
COPY --from=build /app/src/Scripts /usr/share/nginx/html/Scripts

# Create directory for Let's Encrypt challenges
RUN mkdir -p /var/www/certbot

# Expose ports 80 and 443 for HTTP and HTTPS
EXPOSE 80 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
