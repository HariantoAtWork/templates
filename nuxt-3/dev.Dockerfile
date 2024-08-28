FROM node:20.16-alpine

EXPOSE 3000

RUN apk update && apk upgrade
ENV NODE_WORKDIR=/app
WORKDIR $NODE_WORKDIR

COPY package.json $NODE_WORKDIR/
RUN npm shrinkwrap
RUN npm install
COPY . $NODE_WORKDIR

CMD ["npm", "run", "dev"]