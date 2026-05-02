# Stage 1: Build the React application
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
# Install dependencies including the legacy-peer-deps to avoid any react version conflicts
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
# Copy the build output from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html
# Expose port 8080 as Cloud Run expects applications to listen on 8080 by default
EXPOSE 8080
# Copy the custom nginx configuration to route our Single Page App correctly
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
