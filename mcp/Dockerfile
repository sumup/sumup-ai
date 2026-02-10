FROM node:25-alpine@sha256:fd164609b5ab0c6d49bac138ae06c347e72261ec6ae1de32b6aa9f5ee2271110

RUN npm install -g typescript

RUN addgroup -S group && adduser -S user -G group

WORKDIR /app

COPY . .

RUN npm install --frozen-lockfile && npm run build

USER user

ENTRYPOINT ["node", "/app/dist/index.mjs"]
