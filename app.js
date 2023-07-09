const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect("mongodb://127.0.0.1/mestodb");

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: "64a7dc061d5687ce79695bf7",
  };

  next();
});
app.use("/users", require("./routes/users"));
// eslint-disable-next-line import/newline-after-import
app.use("/cards", require("./routes/cards"));
app.get("*", (req, res) => {
  res.status(404).send({ message: "Not found" });
});

app.listen(PORT);
