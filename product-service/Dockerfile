FROM node:20-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev -f
COPY . .
RUN npm run build

EXPOSE 3002
CMD ["npm", "run", "start:prod"]
