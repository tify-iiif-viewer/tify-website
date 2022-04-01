FROM alpine/git as git

WORKDIR /app

COPY . /app/website/

RUN cd /app && \
    git clone https://github.com/tify-iiif-viewer/tify && \
    cd tify && \
    git checkout next

FROM node:16-alpine as node

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY --from=git /app/ /app/

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
RUN cd /app/website && \
    npm install -g npm && \
    npm ci && \
    npm run build

FROM nginx:1-alpine

COPY --from=node /app/website/dist/ /usr/share/nginx/html/
