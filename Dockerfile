FROM mhart/alpine-node:12

RUN mkdir /app

WORKDIR /app

COPY . /app

RUN npm install

RUN source /app/env

EXPOSE 3333

RUN cd /app

RUN ./npapi.js

CMD ["sh"]
