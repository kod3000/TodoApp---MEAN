FROM node:18-slim

WORKDIR /app
COPY package*.json ./
COPY . .

RUN npm install -g @angular/cli

RUN npm install
EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0"]
