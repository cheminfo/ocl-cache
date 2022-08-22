FROM node:18

EXPOSE 20808

RUN mkdir /node
COPY src /node/src
COPY package.json /node/

WORKDIR /node
RUN npm i 

COPY tsconfig* /node/

CMD npm start