CREATE DATABASE notes_app;
USE notes_app;

CREATE TABLE notes
(
    id integer PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    contents TEXT NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

