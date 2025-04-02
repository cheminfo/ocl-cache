FROM node:22

EXPOSE 20822

RUN mkdir /node

COPY package.json /node/
COPY package-lock.json /node/
WORKDIR /node
RUN npm ci 

COPY src /node/src

CMD npm start