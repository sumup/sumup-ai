FROM node:26-alpine@sha256:0b36e8c136b94cd4fcf02188228e76c31ad5872eef3fec8cbd2eee500cfd9e80

RUN npm install -g typescript

RUN addgroup -S group && adduser -S user -G group

WORKDIR /app

COPY . .

RUN npm ci && npm run build

USER user

ENTRYPOINT ["node", "/app/dist/index.mjs"]
