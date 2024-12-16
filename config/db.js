const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL = process.env.DB_URL;

const dbconnect = async () => {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("db connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = dbconnect;
