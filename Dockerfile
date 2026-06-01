# deps
FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# build
FROM node:20-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# runtime
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# standalone server + static + public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 8080
CMD ["node", "server.js"]