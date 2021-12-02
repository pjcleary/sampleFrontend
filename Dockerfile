FROM node

ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir -p /sample_frontend
WORKDIR /sample_frontend
COPY ./ ./

RUN npm install

EXPOSE 3000

#docker-compose build
#docker-compose up
#docker exec -it sample_frontend /bin/bash