const mongoose = require("mongoose");


//get access to Schema constructor
const Schema = mongoose.Schema;
const subData = new Schema({
  name: String,
  task: String,
  completed: Boolean,
  time: Date,
  todoid: String,
})
const columnData = new Schema({
  0: {
    type: String,
    default: "name"
  },
  1: {
    type: String,
    default: "task"
  },
  2: {
    type: String,
    default: "actions"
  }
})
const subtasks = new Schema({
  id: String,
  data:[
    {subData}
  ],
  columns:[
    { columnData}
  ],
})
//create a new schema for our app
const schema = new Schema({
  todoid: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: "",
  },
  task: {
    type: String,
    default: "",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  time: {
    type: Date,
    default: new Date(),
    required: false
  },
  subtasks: {
    type: [subtasks],
    required: false
  }

});

const startupWithDataSamples =[ 
  {
    "todoid" : "9800c4f144641ebc3dd63cba",
    "name" : "Go Enjoy The Day",
    "task" : "When its not raining.. make sure to enjoy the outside.",
    "completed" : true,
    "subtasks" : [],
  },
  {
  "todoid" : "62fc8bc17c6cb4917af0a52f",
  "name" : "Take a jog",
  "task" : "Remember to go jogging at 4pm",
  "completed" : false,
  "subtasks" : [],
}
]


schema.pre('find', function (next) {

  // make sure the db is populated..
  const checkModel = mongoose.model("todo", schema);

  checkModel.countDocuments().then((count) => {
    if (count === 0) {
      // if no data, populate the db with sample data
      startupWithDataSamples.forEach((sample) => {
        // lets populate the db with sample data
        const tempModel = new checkModel(sample);
        tempModel.save();
      });
  }
  });
  next();
});
// export the model with associated name and schema
module.exports = mongoose.model("todo", schema);
