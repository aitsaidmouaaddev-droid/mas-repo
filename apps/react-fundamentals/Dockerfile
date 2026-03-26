# ── Stage 1: install dependencies (cached layer) ─────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --ignore-scripts

# ── Stage 2: compile TypeScript + rewrite path aliases ───────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# Copy everything needed to compile server + libs
COPY tsconfig.base.json ./
COPY libs/nest/ libs/nest/
COPY apps/react-fundamentals/server/ apps/react-fundamentals/server/
COPY apps/react-fundamentals/migrations/ apps/react-fundamentals/migrations/
COPY apps/react-fundamentals/datasource.ts apps/react-fundamentals/
COPY apps/react-fundamentals/graphql/schema.gql apps/react-fundamentals/graphql/

# Compile TS → JS, then rewrite @mas/* aliases to relative paths
RUN npx tsc -p apps/react-fundamentals/server/tsconfig.server.build.json && \
    npx tsc-alias -p apps/react-fundamentals/server/tsconfig.server.build.json

# ── Stage 3: lean production image (no devDeps, no ts-node) ──────────────────
FROM node:20-alpine
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist/server ./dist/server

ENV NODE_ENV=production
EXPOSE 4311

CMD ["node", "dist/server/apps/react-fundamentals/server/main.js"]
