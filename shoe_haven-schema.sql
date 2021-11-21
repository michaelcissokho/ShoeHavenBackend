CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  isAdmin BOOLEAN
);

CREATE TABLE listings (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  picture TEXT,
  price FLOAT,
  details TEXT NOT NULL,
  sold BOOLEAN,
  stripe_product_id TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL
);

CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  listing SERIAL REFERENCES listings,
  buyer VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  stripe_payment_intent_id TEXT NOT NULL,
  returned BOOLEAN
);

CREATE TABLE refunds (
  id SERIAL PRIMARY KEY,
  stripe_refund_id TEXT NOT NULL,
  sale SERIAL REFERENCES sales
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  commentor VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  body TEXT NOT NULL,
  timeSubmitted TIMESTAMP
);