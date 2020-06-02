FROM node:10.16.3-alpine as baseimage

RUN npm i npm@latest -g
RUN apk update && apk upgrade && \
    apk add --no-cache git g++ make bash zlib-dev libpng-dev rsync curl python3-dev python


FROM baseimage as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=NODE_ENV
ENV VUE_APP_API_SERVER=VUE_APP_API_SERVER
ENV VUE_APP_POLLING_SERVER=VUE_APP_POLLING_SERVER
ENV VUE_APP_POLLING_INTERVAL_MS=VUE_APP_POLLING_INTERVAL_MS
RUN npm run build


FROM nginx:1.14-alpine
EXPOSE 5000
WORKDIR /
RUN mkdir -p /var/logs/
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app /dist

