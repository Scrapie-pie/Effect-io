FROM node:10.16.3-alpine as baseimage

RUN npm i npm@latest -g
RUN apk update && apk upgrade && \
    apk add --no-cache git g++ make bash zlib-dev libpng-dev rsync curl python3-dev python


FROM baseimage as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM nginx:1.14-alpine
ENV VUE_APP_SENTRY=on
ENV VUE_APP_API_SERVER=http://api
ENV VUE_APP_POLLING_SERVER=http//polling
ENV VUE_APP_POLLING_INTERVAL_MS=5000
EXPOSE 5000
WORKDIR /
RUN mkdir -p /var/logs/
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app /dist

