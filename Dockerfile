# Stage 1: Build the Angular application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY XLeadV1.0/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY XLeadV1.0/ ./

# Build the application
RUN npm run build --prod

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Copy the built application from the build stage
COPY --from=build /app/dist/XLeadV1.0 /usr/share/nginx/html

# Copy custom nginx configuration (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
