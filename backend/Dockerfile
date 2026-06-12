FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN chmod +x ./node_modules/.bin/tsc && ./node_modules/.bin/tsc

EXPOSE 8080

CMD ["node", "dist/index.js"]