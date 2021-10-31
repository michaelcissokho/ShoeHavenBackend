CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1)
);

CREATE TABLE listings (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users on DELETE CASCADE,
  title TEXT NOT NULL,
  picture TEXT,
  price INTEGER,
  details TEXT NOT NULL,
  sold BOOLEAN
);

CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  listing SERIAL REFERENCES listings,
  seller VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  buyer VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  returned BOOLEAN
);

CREATE TABLE posts(
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  picture TEXT,
  timePosted TIMESTAMP
);

CREATE TABLE comments(
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users on DELETE CASCADE,
  postId SERIAL REFERENCES posts ON DELETE CASCADE,
  body TEXT NOT NULL,
  timeCommented TIMESTAMP
)