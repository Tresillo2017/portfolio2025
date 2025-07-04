FROM node:18-alpine AS base

FROM base AS build
WORKDIR /app
COPY . .
COPY package.json package-lock.json* ./
RUN --mount=type=cache,id=npm,target=/root/.npm npm ci --omit=dev
ENV NODE_ENV=production
RUN npm run build

FROM base AS dokploy
WORKDIR /app
ENV NODE_ENV=production

# Copy only the necessary files
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
