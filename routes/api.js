/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
const Book = require("../models/book");

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //console.log(req.body);
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, (err, books) => {
        if(err) {
          res.send("error getting all books")
        } else {
          //console.log(books);
          let result = books.map(book => {
            let commentcount = book.comments.length;
            return {
              _id: book._id,
              title: book.title,
              commentcount: commentcount
            }
          })
          res.json(result);
        }
      })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      let book = new Book({
        title,
        created_on: new Date(),
        updated_on: new Date()
      });
      
      book.save((err, result) => {
        if(err) {
          res.status(500)
          res.send("title is required");
        } else {
          res.json({
            _id: result._id,
            title: result.title
          });
        }
      });
      
      //I can post a title to /api/books to add a book and returned will be the object with the title and a unique _id.
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err) => {
        if (err) {
          res.status(500);
          res.send(`could not delete collection`);
        }
        res.send(`complete delete successful`);
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, (err, book) => {
        if(err || !book) {
          res.status(500);
          return res.send('no book exists');
        }
        
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        })
      })
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    
      Book.findById(bookid, (err, book) => {
        if(err || !book) {
          res.json()
        }
        
        book.comments.push(comment);
        
        book.save((err, result) => {
          if(err) {
            res.json(err);
          } else {
            res.json({
              _id: result._id,
              title: result.title,
              comments: result.comments
            });
          }
        })
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      
      if (!bookid) {
        return res.send("_id error");
      }

      Book.deleteOne({ _id: bookid }, (err) => {
        if (err) {
          res.status(500);
          res.send(`could not delete ${bookid}`);
        }
        res.send(`delete successful`);
      });
    });
  
};
