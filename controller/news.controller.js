const {
  selectedTopics,
  fetchedArticles,
  fetchArticleById,
  fetchCommentsById,
  insertCommentById,
  patchedArticleById,
  selectedUsers,
  getDeletedCommentsById,
} = require("../model/news.model");

exports.getTopics = (req, res, next) => {
  selectedTopics()
    .then((result) => {
      res.status(200).send({ topics: result });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  fetchedArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((results) => {
      res.status(200).send({ results });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsById(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
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

exports.getPatchedArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const votes = req.body;
  patchedArticleById(article_id, votes)
    .then((updatedArticle) => {
      res.status(201).send({ article: updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  selectedUsers()
    .then((result) => {
      res.status(200).send({ users: result });
    })
    .catch(next);
};

exports.deleteCommentsById = (req, res, next) => {
  const { comment_id } = req.params;
  getDeletedCommentsById(comment_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
};
