# ---- Build stage ----
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Install deps first (layer cache)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build-time VITE_ args (injected from Cloud Build)
ARG VITE_BASE_URL
ARG VITE_NEXUSCORE_API_URL
ARG VITE_GEODE_URL
ARG VITE_WEBHOOK_URL

ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_NEXUSCORE_API_URL=$VITE_NEXUSCORE_API_URL
ENV VITE_GEODE_URL=$VITE_GEODE_URL
ENV VITE_WEBHOOK_URL=$VITE_WEBHOOK_URL

COPY . .
RUN bun run build

# ---- Runtime stage ----
FROM oven/bun:1-alpine

WORKDIR /app

# Only copy the built output and runtime deps
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json ./

# Runtime secrets — injected via docker-compose env_file at startup
# BETTER_AUTH_SECRET, BETTER_AUTH_URL
# DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET
# NEXUSCORE_CLIENT_ID, NEXUSCORE_CLIENT_SECRET

EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]