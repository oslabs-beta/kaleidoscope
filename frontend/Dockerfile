FROM node:18.17

WORKDIR /usr/src/app/frontend

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]