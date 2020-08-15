FROM node:alpine

WORKDIR usr/src/app

COPY package.json  .

COPY package-lock.json .

COPY ormconfig.json ./

RUN npm install

ADD . /usr/src/app

RUN npm run build


CMD [ "npm", "start" ]

EXPOSE 4000
