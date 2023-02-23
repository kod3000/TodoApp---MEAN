const Todo = require('../models/todo.js');


// -------------------------------------------------------------------------------------------------------------
// @ Todo Service |  Here we interact directly with the database.
// -------------------------------------------------------------------------------------------------------------


class TodoService {

  static create(obj) {
    const todo = new Todo(obj);
    return todo.save();
  }
  static list() {
    return Todo.find({})
      .then((todo) => {
        // found
        return todo;
      });
  }
  static update(id, data) {
    return Todo.findOne({todoid:id})
      .then((todo) => {
        todo.set(data);
        todo.save();
        return todo;
      });
  }
  static delete(id) {
    return Todo.deleteOne({
      _id: id
    })
      .then((obj) => {
        //removed
        return obj;
      })
  }
}
module.exports.TodoService = TodoService;
