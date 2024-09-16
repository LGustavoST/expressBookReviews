const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  const filteredUsers = users.filter(user => user.username === username)
  return filteredUsers.length === 0
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const filteredUsers = users
                      .filter(user => user.username === username 
                      && user.password === password)
  return filteredUsers.length > 0
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const credentials = req.body

  if(!credentials.username || !credentials.password){
    res.status(401).json({'message': 'You must send an username and password'})
  }

  if(authenticatedUser(credentials.username, credentials.password)){
    let accessToken = jwt.sign({
        data: credentials
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token in session
    req.session.authorization = {
        accessToken
    }
    res.status(200).json({"message": `Welcome ${credentials.username}!`})
  } else {
    users.push(credentials)
    res.status(401).json({"message": `User not found!`})
  }


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn
  const review = req.body.review
  let userData = {};

  let token = req.session.authorization['accessToken']; // Access Token
  jwt.verify(token, "access", (err, user) => {
      userData = user.data
  });

  if(!review){
    res.status(401).json({'message': 'Review empty or not valid!'})
  }
  if(books[isbn]){
    bookReviews = books[isbn].reviews
    if(Array.isArray(bookReviews)){
        books[isbn].reviews = books[isbn]
                              .reviews
                              .filter(review => review.user !== userData.user)
    } else {
      books[isbn].reviews = []
    }
    books[isbn].reviews.push({ 'user': userData.username, 'review': review })
    res.status(204).json({"message": `Review posted`})
  } else {
    res.status(404).json({"message": `Book not found!`})
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn

  let userData = {};

  let token = req.session.authorization['accessToken']; // Access Token
  jwt.verify(token, "access", (err, user) => {
      userData = user.data
  });

  if(books[isbn]){
    if(Array.isArray(books[isbn].reviews)){
      books[isbn].reviews = books[isbn].reviews.filter(review => review.user === userData.username)
    } 
    res.status(204).json({'message': 'review deleted!'})
  } else {
    res.status(404).json({'message': 'book not found!'})
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
