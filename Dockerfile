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
COPY nginx.conf /etc/nginx/nginx.conf
# Copy the build output to the Nginx html directory
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost || exit 1
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]