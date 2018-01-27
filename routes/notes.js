const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Load Note model
require("../models/Note");
const Note = mongoose.model("notes");

//Note get routes
router.get('/', (req, res) => {
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

router.get('/add', (req, res) => {
    res.render('notes/add');
});

router.get('/edit/:id', (req, res) => {
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
router.post('/', (req, res) => {
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
router.put("/:id", (req, res) => {
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

router.delete('/:id', (req, res) => {
    Note.remove({
        _id: req.params.id
    })
    .then(() => {
        req.flash("success_msg", "Note successfully deleted.");
        res.redirect("/notes");
    });
});

module.exports = router;
