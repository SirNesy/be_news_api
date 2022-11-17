const {
  selectedTopics,
  fetchedArticles,
  fetchArticleById,
  fetchCommentsById,
  insertCommentById,
} = require("../model/news.model");

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

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((result) => {
      res.status(200).send({ result });
    })
    .catch(next);
};

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsById(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postedCommentById = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  insertCommentById(article_id, comment)
    .then((addedComment) => {
      res.status(201).send({ comment: addedComment });
    })
    .catch((err) => {
      next(err);
    });
};
