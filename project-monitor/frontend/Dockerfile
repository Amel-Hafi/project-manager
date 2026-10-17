# Multi-stage Dockerfile for Project Monitor Frontend
# Stage 1: Build Angular app with Node.js
# Stage 2: Serve with nginx

# ---- Build Stage ----
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for dependency caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code and build
COPY . .
RUN npx ng build --configuration=production

# ---- Runtime Stage ----
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app from build stage
COPY --from=build /app/dist/project-monitor-frontend/browser /usr/share/nginx/html

# Security: run as non-root user
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
