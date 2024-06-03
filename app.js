const express = require("express");
const { ObjectId } = require('mongodb');
const {connectToDb, getDb } = require("./db");

// init app and middleware

const app = express();
app.use(express.json())

// db connection

let db;

connectToDb((err) => {
    if (!err) {
        app.listen('5001', () => {
            console.log("App listening on port 5001 on dev branch");
        });

        db = getDb();
    }
}); 


app.get('/', (req, res) => {
    res.status(200).json({message: "hello, world"});
}


// routes
app.get('/books', (req, res) => {
    // current page
    const page = req.query.p || 0;
    const booksPerPage = 3;

    let books = [];

    db.collection('books')
    .find()
    .sort({author: 1})
    .skip(page * booksPerPage)
    .limit(3)
    .forEach(book => books.push(book))
    .then(() => {
        res.status(200).json(books);
    })
    .catch(() => {
        res.status(500).json({error: "Couldn't fetch documents!"})
    });
    // cursor toArray - forEach
    // 101 entries by default in a batch
});

app.get('/books/:id', (req, res) => {

    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({error: "Invalid ID!"});
    }

    db.collection('books')
    .findOne({_id: new ObjectId(req.params.id)})
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        res.status(500).json({error: "Couldn't fetch document!"});
    });
});

app.post('/books', (req, res) => {
    const book = req.body;
    db.collection('books')
    .insertOne(book)
    .then(result => {
        res.status(201).json(result);
    })
    .catch(err => {
        res.status(500).json({error: "Couldn't create document!"});
    });
});

app.delete('/books/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({error: "Invalid ID!"});
    }

    db.collection('books')
    .deleteOne({_id: new ObjectId(req.params.id)})
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        res.status(500).json({error: "Could not delete the document!"});
    });
});

app.patch('/books/:id', (req, res) => {

    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({error: "Invalid ID!"});
    }

    const updates = req.body;

    db.collection('books')
    .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
    .then(result => {
        res.status(201).json(result);
    })
    .catch(err => {
        res.status(500).json({error: "Couldn't update document!"});
    });
});
