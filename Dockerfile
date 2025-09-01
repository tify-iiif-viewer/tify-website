FROM node:22-alpine as node

WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY . /app/

RUN set -x  && \
    apk update && \
    apk upgrade && \
    apk add --no-cache \
          udev \
          ttf-freefont \
          chromium \
          nss \
          freetype \
          harfbuzz \
          ca-certificates \
          ttf-freefont

RUN addgroup -S pptruser && adduser -S -G pptruser pptruser && \
    mkdir -p /home/pptruser/Downloads /app && \
    chown -R pptruser:pptruser /home/pptruser && \
    chown -R pptruser:pptruser /app && \
    chown -R pptruser:pptruser /usr/local

USER pptruser

RUN npm install -g npm
RUN cd /app \
    && npm ci \
    && NODE_OPTIONS=--openssl-legacy-provider npm run build \
    && rm -rf node_modules

FROM caddy:2-alpine

COPY --from=node /app/dist/ /usr/share/caddy/
