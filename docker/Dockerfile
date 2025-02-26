FROM node:18

EXPOSE 20808

RUN mkdir /node

COPY package-lock.json /node/
WORKDIR /node
RUN npm ci 

COPY tsconfig* /node/
COPY src /node/src
COPY scripts /node/scripts

CMD npm start