# ==========================================
# Stage 1: Build Angular app-cloud-demo using Nx
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for Docker layer caching
COPY package*.json .npmrc* ./
RUN npm ci --legacy-peer-deps

# Copy full monorepo source
COPY . .

# Build app-cloud-demo in production mode
RUN npx nx build app-cloud-demo --configuration=production

# ==========================================
# Stage 2: Serve with Nginx (with CORS enabled)
# ==========================================
FROM nginx:1.25-alpine

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from builder stage
COPY --from=builder /app/dist/apps/app-cloud-demo /usr/share/nginx/html

# Copy custom nginx configuration with CORS headers for Module Federation
COPY apps/app-cloud-demo/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
