//Vars
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const port = 5000;

//Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Routes
app.get('/', (req, res) => {
    res.render("index", {
        title: "Welcome to Quick Jot"
    });
});

app.get('/about', (req, res) => {
    res.render('about')
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

