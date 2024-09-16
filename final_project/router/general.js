const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.statusCode = 200
  res.json(books)
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  if(books[isbn]) {
    res.statusCode = 200
    res.json(books[isbn])
  } else {
    res.statusCode = 404
    res.json({"message": "book not found!"})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author
  selectedBooks = Object.values(books).filter(book => book.author === author)
  if(selectedBooks.length > 0) {
    res.statusCode = 200
    res.json(selectedBooks)
  } else {
    res.statusCode = 404
    res.json({"message": "book not found!"})
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title
  selectedBooks = Object.values(books).filter(book => book.title === title)
  if(selectedBooks.length > 0) {
    res.statusCode = 200
    res.json(selectedBooks)
  } else {
    res.statusCode = 404
    res.json({"message": "book not found!"})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //
});

module.exports.general = public_users;
