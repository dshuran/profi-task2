var express = require("express");
var app = express();
app.use(express.json());

const JSONdb = require('simple-json-db');
const db = new JSONdb('src/database.json');

const notesKey = 'notes';

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

app.post("/notes", ((req, res) => {
    console.log(req.body);

    if (req.body.title && req.body.content) {

        const currentId = getNewId();

        let note =  {
            id: currentId,
            title: req.body.title,
            content: req.body.content,
        };

        db.set(`notes/${currentId}`, note);

        res.send(note);
    } else {
        res.sendStatus(400);
    }
}));

app.get("/notes", (req, res) => {
    let notes = db.get(notesKey)
    if (!notes) {
        notes = [];
    }
    res.json(notes);
});

app.get("/notes/:id", ((req, res) => {
    console.log(req.params.id)
    let note = db.get(`notes/${req.params.id}`);
    if (note) {
        res.json(note);
    } else {
        res.json(400);
    }
}))



function getNewId() {
    let lastId = db.get('lastId') | 0;
    let newId = lastId + 1;
    db.set('lastId', newId);

    return newId;
}