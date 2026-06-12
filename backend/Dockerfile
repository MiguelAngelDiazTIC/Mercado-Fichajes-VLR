FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN ./node_modules/.bin/tsc

EXPOSE 3000

CMD ["node", "dist/index.js"]