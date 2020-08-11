const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Book = new Schema({
  //title, _id, & an array of comments
  title: {
    type: String,
    required: true
  },
  comments: {
    type: [],
    //required: true
  },
  created_on: {
    type: Date,
    //required: true
  },
  updated_on: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('Book', Book);