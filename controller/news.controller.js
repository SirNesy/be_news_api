const { selectedTopics, fetchedArticles } = require("../model/news.model");

exports.getTopics = (req, res, next) => {
  selectedTopics()
    .then((result) => {
      res.status(200).send({ topics: result });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by } = req.query;
  fetchedArticles(sort_by)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
