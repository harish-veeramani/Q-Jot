const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");

require("../models/User");
const User = mongoose.model("users");

module.exports = router;

//Login routes
router.get('/login', (req, res) => {
    res.render("users/login");
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/notes",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);
})

//Register routes
router.get('/register', (req, res) => {
    res.render("users/register");
});

router.post('/register', (req, res) => {
    var errors = [];

    if(req.body.password != req.body.password2){
        errors.push({text: "Passwords do not match"})
    }

    if(req.body.password.length < 4){
        errors.push({text: "Password must be at least 4 characters long"})
    }

    if(errors.length > 0){
        res.render("users/register", {
            errorList: errors,
            name: req.body.name,
            email: req.body.email
        });
    } else {
        User.findOne({
            email: req.body.email
        }).then(user => {
            if(user){
                req.flash("error_msg", "Email already registered");
                res.redirect("/users/register");
            } else {
                var newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
        
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err){
                            throw err;
                        }
                        newUser.password = hash;
                        newUser.save().then(user => {
                            req.flash("success_msg", "You are now registered and can log in.");
                            res.redirect("/users/login");
                        })
                        .catch(err => {
                            console.log(err);
                            return;
                        });
                    });
                });  
            }
        });
    }
});