FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm --loglevel=error install 

COPY . .

CMD ["npm", "start"]
