# Stage 1. Base
FROM node:18.12-alpine AS base
RUN mkdir -p /home/node/app
RUN chown -R node:node /home/node && chmod -R 770 /home/node
WORKDIR /home/node/app
# Stage 2. Building server side
FROM base AS builder-server
WORKDIR /home/node/app
RUN apk add --no-cache git make g++
COPY --chown=node:node ./package.json ./package.json
USER node
#RUN npm install --loglevel warn --production
RUN npm install --loglevel warn
# Stage 3. Building client side
FROM builder-server AS builder-client
WORKDIR /home/node/app
COPY --chown=node:node . .
USER node
RUN npm install --loglevel warn
# Stage 4. Production ready image
FROM base AS production
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
WORKDIR /home/node/app
USER node
#USER root
COPY --chown=node:node --from=builder-server /home/node/app/node_modules ./node_modules
COPY --chown=node:node ./package.json ./package.json
COPY --chown=node:node . .
EXPOSE 3000
CMD ["npm", "start"]