# syntax=docker/dockerfile:1
FROM node:14.18-bullseye AS basebuild
WORKDIR /app

COPY . .

RUN npm ci --include=dev && npm run build

FROM node:14.18-alpine AS prod
WORKDIR /app

ENV NODE_END=production

COPY --from=basebuild /app/dist/ ./dist/

COPY package*.json ./

RUN apk add --no-cache curl && \
  npm ci --only=prod --no-optional

USER node

HEALTHCHECK --interval=3m --timeout=5s --retries=3 CMD [ "curl", "--fail", "http://localhost:5000/healthcheck" ]

CMD ["node", "dist/server/start.js"]