//Constant vars
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();

//Load and use routes
const notes = require("./routes/notes");
const users = require("./routes/users");

//Passport Config
require("./config/passport")(passport);

mongoose.Promise = global.Promise;

//Static folder
app.use(express.static(__dirname + '/public'));

//Connect to MongoDB
const db = require("./config/database");
mongoose.connect(db.mongoURI)
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

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Message variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
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

const port = process.env.PORT || 4567;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

