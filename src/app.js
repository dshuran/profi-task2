const config = require('./../config.js')

var express = require("express");
var app = express();
app.use(express.json());

const JSONdb = require('simple-json-db');
const db = new JSONdb('src/database.json');

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});

app.post("/notes", ((req, res) => {
    const currentId = getNewId();

    let note =  {
        id: currentId,
        title: req.body.title,
        content: req.body.content,
    };

    db.set(`notes/${currentId}`, note);

    res.send(note);
}));

app.get("/notes", (req, res) => {
    let notes = [];
    let id = 1;
    let lastId = db.get('lastId');
    while(id <= lastId) {
        let note = db.get(`notes/${id}`);
        if (note) {
            if (!note.title) {
                note.title = note.content.substr(0, config.nClip);
            }
            notes.push(note)
        }
        id++;
    }

    res.json(notes);
});

app.get("/notes/:id", ((req, res) => {
    let note = db.get(`notes/${req.params.id}`);
    if (note) {
        if (!note.title) {
            note.title = note.content.substr(0, config.nClip);
        }
        res.json(note);
    } else {
        res.json(400);
    }
}))

app.put("/notes/:id", (req, res) => {
    let note = db.get(`notes/${req.params.id}`);
    if (!note) {
        res.sendStatus(400);
        return;
    }
    if (req.body.title) {
        note.title = req.body.title;
    }
    if (req.body.content) {
        note.content = req.body.content;
    }
    db.set(`notes/${req.params.id}`, note);

    res.json(note);
})

app.delete("/notes/:id", (req, res) => {
    let note = db.get(`notes/${req.params.id}`);
    if (!note) {
        res.sendStatus(400);
        return;
    }

    db.delete(`notes/${req.params.id}`);

    res.sendStatus(200);
})



function getNewId() {
    let lastId = db.get('lastId') | 0;
    let newId = lastId + 1;
    db.set('lastId', newId);

    return newId;
}