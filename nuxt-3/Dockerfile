FROM node:20.16-alpine

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_WORKDIR=/app
WORKDIR $NODE_WORKDIR

# COPY package.json $NODE_WORKDIR/
# RUN npm shrinkwrap
# RUN npm i
COPY .output $NODE_WORKDIR

CMD ["node", "server/index.mjs"]