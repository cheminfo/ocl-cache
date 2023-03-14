FROM node:18

EXPOSE 20808

RUN mkdir /node

COPY package.json /node/
WORKDIR /node
RUN npm i 

COPY tsconfig* /node/
COPY src /node/src
COPY scripts /node/scripts

CMD npm start