FROM mhart/alpine-node:12

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN cd /app && \
    npm install --only=production && \
    source /app/env

RUN npm start
CMD ["/bin/sh"]
