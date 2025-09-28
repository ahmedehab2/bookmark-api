# Install dependencies
FROM node:20-alpine AS install
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci

# Build the application
FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine AS production
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]