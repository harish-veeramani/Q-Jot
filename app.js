//Constant vars
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");

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

//Method override middleware
app.use(methodOverride("_method"));

//Express session middleware
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

//Error message middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

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
            errorList: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        var newNote = {
            title: req.body.title,
            details: req.body.details
        }
        new Note(newNote).save().then(note => {
            req.flash("success_msg", "Note successfully added.");
            res.redirect("/notes");
        });
    }
});

//Edit form
app.put("/notes/:id", (req, res) => {
    Note.findOne({
        _id: req.params.id
    })
    .then(note => {
        note.title = req.body.title;
        note.details = req.body.details;

        note.save().then(note => {
            req.flash("success_msg", "Note successfully edited.");
            res.redirect("/notes");
        });
    });
});

app.delete("/notes/:id", (req, res) => {
    Note.remove({
        _id: req.params.id
    })
    .then(() => {
        req.flash("success_msg", "Note successfully deleted.");
        res.redirect("/notes");
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

