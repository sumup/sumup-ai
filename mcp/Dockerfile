FROM node:26-alpine@sha256:725aeba2364a9b16beae49e180d83bd597dbd0b15c47f1f28875c290bfd255b9

RUN npm install -g typescript

RUN addgroup -S group && adduser -S user -G group

WORKDIR /app

COPY . .

RUN npm install --frozen-lockfile && npm run build

USER user

ENTRYPOINT ["node", "/app/dist/index.mjs"]
