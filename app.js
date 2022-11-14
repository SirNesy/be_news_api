const express = require("express");
const { handlePSQLErrors } = require("./controller/errror.controller");
const { getTopics } = require("./controller/news.controller");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "invalid URL!" });
});

app.use(handlePSQLErrors);
module.exports = app;
