FROM node:10.16.3-alpine as baseimage

RUN npm i npm@latest -g
RUN apk update && apk upgrade && \
    apk add --no-cache git g++ make bash zlib-dev libpng-dev rsync curl python3-dev python


FROM baseimage as builder
WORKDIR /app
#COPY package*.json vue.config.js ./
COPY . .
RUN npm install
#COPY . .
ARG NODE_ENV
ARG VUE_APP_API_SERVER
ARG VUE_APP_POLLING_SERVER
ARG VUE_APP_POLLING_INTERVAL_MS
ARG VUE_APP_IS_DOCKER
ARG VUE_APP_ENV
ARG VUE_BUILD_COMMAND
ENV NODE_ENV=${NODE_ENV}
ENV VUE_APP_API_SERVER=${VUE_APP_API_SERVER}
ENV VUE_APP_POLLING_SERVER=${VUE_APP_POLLING_SERVER}
ENV VUE_APP_POLLING_INTERVAL_MS=${VUE_APP_POLLING_INTERVAL_MS}
ENV VUE_APP_IS_DOCKER=${VUE_APP_IS_DOCKER}
ENV VUE_APP_ENV=${VUE_APP_ENV}
ENV VUE_BUILD_COMMAND=${VUE_BUILD_COMMAND}

RUN npm run $VUE_BUILD_COMMAND


FROM nginx:1.14-alpine
EXPOSE 5000
WORKDIR /
RUN mkdir -p /var/logs/
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app /dist

