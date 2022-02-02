FROM node:14-alpine 
WORKDIR /home/app/backend
COPY *.json ./
COPY swagger.yaml ./
RUN npm ci

