const db = require("../db/connection");
const {
  checkIfArticleExists,
  checkIfUsernameExists,
} = require("../db/seeds/utils");

exports.selectedTopics = () => {
  return db.query("SELECT * FROM topics").then((response) => {
    return response.rows;
  });
};

exports.fetchedArticles = (sort_by = "created_at") => {
  const validColumns = ["created_at"];
  if (!validColumns.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "invalid sort query!",
    });
  }
  let queryStr = `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY comments.article_id, articles.article_id
    ORDER BY ${sort_by} DESC;`;

  return db.query(queryStr).then((response) => {
    return response.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      msg: "invalid sort query!",
    });
  }
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found!",
        });
      }
      return result.rows[0];
    });
};

exports.fetchCommentsById = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "invalid article Id!" });
  }
  return checkIfArticleExists(article_id)
    .then(() => {
      return db.query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
        [article_id]
      );
    })
    .then((result) => {
      return result.rows;
    });
};

exports.insertCommentById = (article_id, comment) => {
  const { username, body } = comment;
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "invalid article Id!" });
  }
  return Promise.all([
    checkIfArticleExists(article_id),
    checkIfUsernameExists(username),
  ]).then(() => {
    return db
      .query(
        `INSERT INTO comments (author, body, article_id)
      VALUES ($1,$2,$3) RETURNING *;`,
        [username, body, article_id]
      )
      .then((res) => {
        return res.rows[0];
      });
  });
};

exports.patchedArticleById = (article_id, votes) => {
  const { inc_votes } = votes;
  if (!inc_votes || !votes.hasOwnProperty("inc_votes")) {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }
  if (isNaN(inc_votes)) {
    return Promise.reject({ status: 400, msg: "Bad request wrong data type!" });
  }
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }
  return checkIfArticleExists(article_id).then(() => {
    return db
      .query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
        [inc_votes, article_id]
      )
      .then((res) => {
        return res.rows[0];
      });
  });
};
