var express = require('express');
var router = express.Router();

const Todo = require('../controllers/todoController');
const TodoService = Todo.TodoService;


// -------------------------------------------------------------------------------------------------------------
// @ Todo Api Controller |  Here you will find create, read, update, delete, and list methods for the todo model.
// -------------------------------------------------------------------------------------------------------------


router.use((req, res, next) => {
  res.set({
    // allow any domain, allow REST methods we've implemented
    // In production, you may want to lock down your cors
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,PATCH,POST,DELETE,OPTIONS',
    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers",
    // Set content-type for all api requests
    'Content-type': 'application/json'
  });
  if (req.method == 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});


// List all todos
router.get('/', (req, res, next) => {
  TodoService.list().then((todo) => {
    res.status(200);
    res.send(JSON.stringify(todo));
  });
});


// Create a new todo
router.post('/add/', (req, res, next) => {
  let todoBuilder = {
    name: req.body.name,
    task: req.body.task,
    todoid: req.body.todoid
  }
  TodoService.create(todoBuilder).then((todo) => {
    console.log("todo event: ", todo)
    res.status(200);
    res.send(JSON.stringify(todo));
  });
});


// Delete a todo by id
router.delete('/delete/:id', (req, res, next) => {
  let id = req.params.id;
  TodoService.delete(req.params.id)
    .then((event) => {
      res.status(200);
      res.send(JSON.stringify(event));
    }).catch((err) => {
    res.status(404);
    res.end();
  });
});


// Update a todo by id via PUT
router.put('/update/:id', (req, res, next) => {
  let updatedData = req.body;
  TodoService.update(req.params.id, updatedData).then((updatedEvent) => {
    res.status(200);
    res.send(JSON.stringify(updatedEvent));
  }).catch((err) => {
    res.status(404);
    res.send("nope..");
    res.end();
  });
});


// Update a todo by id via PATCH
router.patch('/:id', (req, res, next) => {
  let updatedData = req.body;
  TodoService.update(req.params.id, updatedData).then((updatedEvent) => {
    res.status(200);
    res.send(JSON.stringify(updatedEvent));
  }).catch((err) => {
    res.status(404);
    res.send("nope..");
    res.end();
  });
});


// Very barbaric way of error handling
router.use(function (err, req, res, next) {
  console.error(err);
  res.status(500);
  res.send("these are not the droids you are searching for..");
  res.end();
});

module.exports = router; // send the router to the app.js file
