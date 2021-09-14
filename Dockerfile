FROM mhart/alpine-node:12

RUN mkdir /app

COPY . /app

RUN cd /app && \
    npm install --only=production && \
    source /app/env

WORKDIR /app

CMD ["npm", "start"]
