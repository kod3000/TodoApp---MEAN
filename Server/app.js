'use strict';

require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const apiTodos = require('./routes/api.todos');

var monogoOptions = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
};

mongoose.Promise = global.Promise;
async function connect() {
  await mongoose.connect('mongodb://db:27017/admin');
}
connect();


// App
const app = express();
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});
let urlLocal = "/";

app.get('/', (req, res) => {
  res.status(200);
  res.send(JSON.stringify('Hello World'));
});
app.use(urlLocal + 'api/v1/todo', apiTodos);

app.get(urlLocal + 'api/v1/info', (req, res) => {
  res.status(200);
  res.send(JSON.stringify('Hello, server is up and running!'));
});
module.exports = app;
