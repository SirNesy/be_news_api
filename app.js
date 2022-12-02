const express = require("express");

const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsById,
  postedCommentById,
  getPatchedArticleById,
  getUsers,
  deleteCommentsById,
} = require("./controller/news.controller");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postedCommentById);

app.patch("/api/articles/:article_id", getPatchedArticleById);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteCommentsById);

app.get("/api");

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "invalid URL!" });
});
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request!" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server error!" });
});

module.exports = app;
