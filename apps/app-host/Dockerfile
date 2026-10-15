# ==========================================
# Stage 1: Build Angular app-host using Nx
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for Docker layer caching
COPY package*.json .npmrc* ./
RUN npm ci --legacy-peer-deps

# Copy full monorepo source
COPY . .

# Build app-host in production mode
RUN npx nx build app-host --configuration=production

# ==========================================
# Stage 2: Serve with Nginx
# ==========================================
FROM nginx:1.25-alpine

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from builder stage
COPY --from=builder /app/dist/apps/app-host /usr/share/nginx/html

# Copy custom nginx configuration
COPY apps/app-host/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
