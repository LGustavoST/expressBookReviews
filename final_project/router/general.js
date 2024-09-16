const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


async function getBooks(param = undefined){
  return new Promise((resolve, reject) => {
    if(param === undefined){
      resolve(books);
    }
    if (!Number.isNaN(parseInt(param))){
      (books[param]) ? resolve(books[param]) : reject("book not found!")
    }
    if(Object.entries(param).length > 0){
      let filteredBooks = Object.values(books).filter(book => {
          return Object
              .entries(param)
              .reduce((bookMatch, entry) => { 
                  return bookMatch && book[entry[0]] === entry[1] 
              }, true)
      })
      filteredBooks.length > 0 ? resolve(filteredBooks) : reject("book not found!")
    }
    reject("book not found!")
  })
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const credentials = req.body

  if(!credentials.username || !credentials.password){
    res.status(401).json({'message': 'You must send an username and password'})
  }

  if(isValid(credentials.username)){
    users.push(credentials)
    res.status(201).json({"message": `User ${credentials.username} created!`})
  } else {
    res.status(401).json({'message': `Username ${credentials.username} already used!`})
  }

});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  res.status(200).json(await getBooks())
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  getBooks(isbn)
  .then(books => res.status(200).json(books))
  .catch(err => res.status(404).json({"message": "book not found!"}))
  /*
  if(await books[isbn]) {
    res.status(200).json(books[isbn])
  } else {
    res.status(404).json({"message": "book not found!"})
  }*/
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author
  getBooks({'author': author})
  .then(books => res.status(200).json(books))
  .catch(err => res.status(404).json({"message": "book not found!"}))
  /*
  selectedBooks = Object.values(books).filter(book => book.author === author)
  if(selectedBooks.length > 0) {
    res.status(200).json(selectedBooks)
  } else {
    res.status(404).json({"message": "book not found!"})
  }
  */
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title
  /*selectedBooks = Object.values(books).filter(book => book.title === title)
  if(selectedBooks.length > 0) {
    res.status(200).json(selectedBooks)
  } else {
    res.status(404).json({"message": "book not found!"})
  }*/
    getBooks({'title': title})
    .then(books => res.status(200).json(books))
    .catch(err => res.status(404).json({"message": "book not found!"}))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  if(books[isbn]) {
    res.status(200).json(books[isbn].reviews)
    
  } else {
    res.status(404).json({"message": "book not found!"})
  }
    //
});

module.exports.general = public_users;
