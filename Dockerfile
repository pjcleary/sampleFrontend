FROM node

ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir -p /diagnoss_frontend
WORKDIR /diagnoss_frontend
COPY ./ ./

RUN npm install

EXPOSE 3000

#docker-compose build
#docker-compose up
#docker exec -it diagnoss_frontend /bin/bash