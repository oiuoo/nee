require("dotenv").config();
const router = require("./routes/router");

const express = require("express");
var cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/v1", router);

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}!`);
});
