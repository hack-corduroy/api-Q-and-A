DROP DATABASE IF EXISTS q_and_a;
CREATE DATABASE q_and_a;

\c q_and_a;

DROP TABLE IF EXISTS questions;
CREATE TABLE questions(
  id INT PRIMARY KEY,
  product_id INT NOT NULL,
  body TEXT NOT NULL,
  date_written TEXT NOT NULL,
  asker_name TEXT NOT NULL,
  asker_email TEXT,
  reported BOOLEAN NOT NULL,
  helpful INT NOT NULL
);

CREATE INDEX product_index ON questions (product_id);

DROP TABLE IF EXISTS answers;
CREATE TABLE answers(
  id INT PRIMARY KEY,
  question_id INT REFERENCES questions (id),
  body TEXT NOT NULL,
  date_written TEXT NOT NULL,
  answerer_name TEXT NOT NULL,
  answerer_email TEXT,
  reported BOOLEAN NOT NULL,
  helpful INT NOT NULL
);

CREATE INDEX question_index ON answers (question_id);

DROP TABLE IF EXISTS photos;
CREATE TABLE photos(
  id INT PRIMARY KEY,
  answer_id INT REFERENCES answers (id),
  url TEXT NOT NULL
);

CREATE INDEX answer_index ON photos (answer_id);

