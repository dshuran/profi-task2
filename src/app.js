var express = require("express");
var app = express();
app.use(express.json());

const JSONdb = require('simple-json-db');
const db = new JSONdb('src/database.json');

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

app.post("/notes", ((req, res) => {
    console.log(req.body);

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
        console.log(note);
        if (note) {
            notes.push(note)
        }
        id++;
    }

    res.json(notes);
});

app.get("/notes/:id", ((req, res) => {
    let note = db.get(`notes/${req.params.id}`);
    if (note) {
        res.json(note);
    } else {
        res.json(400);
    }
}))

app.put("/notes/:id", (req, res) => {
    let note = db.get(`notes/${req.params.id}`);
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
    db.delete(`notes/${req.params.id}`);

    res.sendStatus(200);
})



function getNewId() {
    let lastId = db.get('lastId') | 0;
    let newId = lastId + 1;
    db.set('lastId', newId);

    return newId;
}