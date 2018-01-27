const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

module.exports = router;

//Login Route
router.get('/login', (req, res) => {
    res.render("users/login");
});

router.get('/register', (req, res) => {
    res.render("users/register");
});