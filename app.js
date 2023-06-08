const express = require("express");
const { connectToDb, getDb } = require("./db.js");
const { ObjectId } = require("mongodb");
//firing the express function
const app = express();
// this will parse any post request into json
app.use(express.json());
let db;
//connecting to db
connectToDb((err) => {
  //here if error hapens then the eror is passed by the function in db.js to here
  //but if no error then we proceed
  // to listening requests
  if (!err) {
    //listening function
    app.listen(3000, () => {
      console.log("listening on 3000 port");
    });
    db = getDb();
  }
});

//route handler
app.get("/books", (req, res) => {
    // if no query is input then 0 will be page number
  const page=req.query.p||0
  //num of books per page
  const numofbooks=2  
    let books = [];
  db.collection("books")
    .find()
    .sort({ title: 1 })
    .skip(page*numofbooks)//here we only fetching the data of ith page
    .limit(numofbooks)
    .forEach((book) => books.push(book)) //it is a cursor method
    .then(() => {
      //since the above function is asynchronous
      //means it takes time to fetch the book
      //therefore we fire a function at the end
      // it sends the status code 200 means its all good
      //and also the books array which contaisns all books
      //and also sends it as a response to the request
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ mssg: "error" });
    });

  //mongodb://localhost:27017
});
// this route is used to fetch a document based on an id
app.get("/books/:id", (req, res) => {
  // here we are using new keword before ObjectId
  // because an error will be generated as a class constructor
  //cannot be invoked without a new keyword
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ mssg: "error fetching data" });
        console.log(err);
      });
  } else {
    res.json({ mssg: "not a valid documentid" });
  }
});
// for adding new document
app.post("/books", (req, res) => {
  const book = req.body;
  db.collection("books")
    .insertOne({ book })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ mssg: "error inserting data" });
    });
});
//for deleting a document
app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ mssg: "error while deleting" });
      });
  } else {
    res.status(500).json({ mssg: "not a valid id found" });
  }
});
// for updating existing document
app.patch("/books/:id", (req, res) => {
  let bodynew = req.body;
  // format for bodynew will be--{"title":"umang","author":"umang"}-- example
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set:bodynew })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ mssg: "error while updating" });
      });
  } else {
    res.status(500).json({ mssg: "not a valid id found" });
  }
});
