FROM mhart/alpine-node:12

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN cd /app && \
    npm install --only=production && \
    source /app/env

EXPOSE 3333

RUN node npapi.js

CMD ["sh"]
