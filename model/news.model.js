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

exports.fetchedArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validColumns = [
    "created_at",
    "title",
    "topic",
    "author",
    "body",
    "votes",
  ];
  const validOrder = ["asc", "desc"];
  if (!validColumns.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid sort query!" });
  }
  let queryStr = `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id`;
  const queryValue = [];
  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryValue.push(topic);
  }
  queryStr += ` GROUP BY comments.article_id, articles.article_id`;
  queryStr += ` ORDER BY ${sort_by} ${order};`;
  return db.query(queryStr, queryValue).then((response) => {
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
  let queryStr = `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY comments.article_id, articles.article_id;`;
  return db.query(queryStr, [article_id]).then((res) => {
    if (res.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article not found!" });
    }
    return res.rows;
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

  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      }
      return res.rows[0];
    });
};

exports.selectedUsers = () => {
  return db.query(`SELECT * FROM users`).then((users) => {
    return users.rows;
  });
};

exports.getDeletedCommentsById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment id not found!" });
      }
      return result.rows[0];
    });
};
