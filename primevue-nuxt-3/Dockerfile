FROM node:20.16-alpine AS builder-base

# Set environment variables in the BUILDER stage
ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_WORKDIR=/app
WORKDIR $NODE_WORKDIR

RUN apk add --update --no-cache
RUN npm i -g pnpm

COPY package.json $NODE_WORKDIR/
# RUN pnpm shrinkwrap
RUN pnpm install
COPY . $NODE_WORKDIR

# CMD ["pnpm", "run", "dev"]
RUN pnpm run build

# New stage for the final image
FROM node:20.16-alpine

# Set the same environment variables in the final stage
ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_WORKDIR=/app
ENV NUXT_HOST=0.0.0.0
WORKDIR $NODE_WORKDIR

# Copy from the BUILDER-BASE stage
COPY --from=builder-base $NODE_WORKDIR/.output $NODE_WORKDIR

EXPOSE 3000

CMD ["node", "server/index.mjs"]
