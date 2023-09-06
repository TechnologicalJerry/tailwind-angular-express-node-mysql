import express from 'express'

import { getNotes, getNote, createNote } from './database.js'

const app = express()

app.use(express.json())