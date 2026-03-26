# ── Stage 1: install dependencies (cached layer) ─────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Copy only what npm ci needs — maximizes Docker layer caching
COPY package.json package-lock.json ./
COPY apps/react-fundamentals/package.json apps/react-fundamentals/
RUN npm ci --ignore-scripts

# ── Stage 2: production image ─────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# Copy tsconfig (needed by tsconfig-paths at runtime to resolve @mas/* aliases)
COPY tsconfig.base.json ./

# Copy only the backend source + libs it depends on
COPY libs/nest/ libs/nest/
COPY apps/react-fundamentals/server/ apps/react-fundamentals/server/
COPY apps/react-fundamentals/graphql/schema.gql apps/react-fundamentals/graphql/
COPY apps/react-fundamentals/migrations/ apps/react-fundamentals/migrations/
COPY apps/react-fundamentals/datasource.ts apps/react-fundamentals/

ENV NODE_ENV=production
ENV TS_NODE_PROJECT=server/tsconfig.server.json
EXPOSE 4311

WORKDIR /app/apps/react-fundamentals
CMD ["node", "-r", "ts-node/register", "-r", "tsconfig-paths/register", "server/main.ts"]
