# Use the official Node.js image as a base image
FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["npm","run", "dev"]
