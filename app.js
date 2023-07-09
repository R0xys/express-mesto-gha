const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect("mongodb://127.0.0.1/mestodb");

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: "64aab5dfe9809b6d25a6d921",
  };

  next();
});
app.use("/users", require("./routes/users"));
// eslint-disable-next-line import/newline-after-import
app.use("/cards", require("./routes/cards"));
app.use("*", (req, res) => {
  res.status(404).send({ message: "Not found" });
});

app.listen(PORT);
