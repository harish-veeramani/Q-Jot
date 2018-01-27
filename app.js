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

//Load and use routes
const notes = require("./routes/notes");
const users = require("./routes/users");

mongoose.Promise = global.Promise;

//Static folder
app.use(express.static(__dirname + '/public'));

//Connect to MongoDB
mongoose.connect("mongodb://localhost/quickjot-dev")
    .then(() => console.log("Connected to database"))
    .catch((error) => console.log(error));

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

//Message variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

//Get Routes
app.use('/notes', notes);
app.use('/users', users);

app.get('/', (req, res) => {
    res.render("index", {
        title: "Welcome to Quick Jot"
    });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

