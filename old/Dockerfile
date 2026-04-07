# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve
FROM nginx:alpine

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app to Nginx's html folder
COPY --from=build /app/dist/rbac-frontend-angular /usr/share/nginx/html

EXPOSE 80