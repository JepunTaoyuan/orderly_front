# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
FROM node:24-slim AS base

FROM base AS deps
WORKDIR /app
ENV NPM_CONFIG_CACHE=/tmp/.npm
ENV NPM_CONFIG_CACHE=/tmp/.npm
COPY package.json package-lock.json ./
RUN npm install && npm cache clean --force && rm -rf /tmp/.npm

# TODO fix: use this layer will cause "Cannot find package buffer-polyfill"
# Setup production node_modules
# FROM base as production-deps
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY package.json package-lock.json ./
# RUN npm prune --omit=dev

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NODE_ENV=production
RUN npm run build
RUN npm prune --omit=dev

FROM base AS runtime
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/build/server ./build/server
COPY --from=builder /app/build/client ./build/client

ENV NODE_ENV=production
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["npm", "run","start"]

