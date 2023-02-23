FROM node:16
RUN echo 'we are running some # of cool things'
# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
