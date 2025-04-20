# Base image
FROM node:18-alpine

WORKDIR /app

# Install dependencies including openssl1.1
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./

# Set Prisma to build for musl target
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=library

# Install Prisma client and dependencies
RUN npm install --build-from-source @prisma/client

# Copy remaining files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# Start
CMD ["npm", "start"]