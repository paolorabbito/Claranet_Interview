FROM node:16.17.0-slim

WORKDIR /claranet

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]