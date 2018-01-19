//Constant vars
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

mongoose.Promise = global.Promise;

//Connect to MongoDB
mongoose.connect("mongodb://localhost/quickjot-dev")
    .then(() => console.log("Connected to database"))
    .catch((error) => console.log(error));

//Load Note model
require("./models/Note");
const Note = mongoose.model("notes");

//Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//Get Routes
app.get('/', (req, res) => {
    res.render("index", {
        title: "Welcome to Quick Jot"
    });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/notes', (req, res) => {
    Note.find({})
    .sort({
        date: "desc"
    })
    .then(notes => {
        res.render('notes/list', {
            notes: notes
        });
    });
});

app.get('/notes/add', (req, res) => {
    res.render('notes/add');
});

app.get('/notes/edit/:id', (req, res) => {
    Note.findOne({
        _id: req.params.id
    })
    .then(note => {
        res.render('notes/edit', {
            note: note
        });
    });
});

//Process Form
app.post('/notes', (req, res) => {
    var errors = [];
    if (!req.body.title){
        errors.push({text: "Please add a title"});
    }
    if (!req.body.details){
        errors.push({text: "Please add details"});
    }

    if (errors.length > 0){
        res.render('notes/add', {
            errorList: errors
        });
    } else {
        var newNote = {
            title: req.body.title,
            details: req.body.details
        }
        new Note(newNote).save().then(note => {
            res.redirect("/notes");
        });
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

