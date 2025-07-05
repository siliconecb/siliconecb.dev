FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production=false
COPY . .
RUN npm run build
RUN npm prune --production

CMD ["node", "server.js"]