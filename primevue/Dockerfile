FROM node:20.16-alpine AS node-modules

# Set environment variables in the BUILDER stage
ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_WORKDIR=/app
WORKDIR $NODE_WORKDIR

RUN apk add --update --no-cache
RUN npm i -g pnpm

COPY package.json $NODE_WORKDIR/
COPY pnpm-lock.yaml $NODE_WORKDIR/
RUN pnpm install

FROM node:20.16-alpine AS builder
# Set environment variables in the BUILDER stage
ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_WORKDIR=/app
WORKDIR $NODE_WORKDIR
ENV PNPM_BIN=/usr/local/bin

COPY . $NODE_WORKDIR
COPY --from=node-modules $NODE_WORKDIR $NODE_WORKDIR

RUN npm i -g pnpm
RUN pnpm run build

# New stage for the final image
FROM node:20.16-alpine

# Set the same environment variables in the final stage
ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_WORKDIR=/app
ENV NUXT_HOST=0.0.0.0
WORKDIR $NODE_WORKDIR

# Copy from the BUILDER stage
COPY --from=builder $NODE_WORKDIR/.output $NODE_WORKDIR

EXPOSE 3000

CMD ["node", "server/index.mjs"]
