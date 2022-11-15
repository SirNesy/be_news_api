const express = require("express");
const { handlePSQLErrors } = require("./errors");
const { getTopics } = require("./controller/news.controller");
const app = express();

app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "invalid URL!" });
});

app.use(handlePSQLErrors);
module.exports = app;
