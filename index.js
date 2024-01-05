require("dotenv").config();
const router = require("./routes/router");
const cookieParser = require('cookie-parser')
const express = require("express");
var cors = require("cors");
// const formidable = require('express-formidable');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(formidable());
app.use(cors({ origin: true }));
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/v1", router);

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}!`);
});
