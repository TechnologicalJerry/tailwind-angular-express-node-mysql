import express from 'express';

import { getNotes, getNote, createNote } from './database.js';

const app = express();

app.use(express.json());

app.get("/notes", async (req, res) => {
    const notes = await getNotes()
    res.send(notes)
});

app.get("/notes/:id", async (req, res) => {
    const id = req.params.id
    const note = await getNote(id)
    res.send(note)
});