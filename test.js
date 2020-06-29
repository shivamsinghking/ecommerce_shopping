var express = require('express');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = "mongodb+srv://shivamsingh:shivam123@cluster0-jvljc.mongodb.net/test?retryWrites=true&w=majority"

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  const db = client.db("test");
  var cursor = db.collection('people').find({}).toArray();
  console.log(cursor)
   
  
//   function iterateFunc(doc) {
//     console.log(JSON.stringify(doc, null, 4));
//   }
  
//   function errorFunc(error) {
//     console.log(error);
//   }
  
//   cursor.forEach(iterateFunc, errorFunc);

  client.close();
});
