"use strict";
/** Database for capstone */
const { Client } = require("pg");
const { getDatabaseLink } = require("./config");

let db;

if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: getDatabaseLink(),
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  db = new Client({
    connectionString: getDatabaseLink()
  });
}

db.connect();

module.exports = db;