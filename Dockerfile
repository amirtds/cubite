FROM node:18-alpine

WORKDIR /app

RUN apk add openssl3

COPY package*.json ./
COPY prisma ./prisma/
COPY .env .env

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000 5555

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

CMD ["docker-entrypoint.sh"]