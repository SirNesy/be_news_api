const db = require("../db/connection");

exports.selectedTopics = () => {
  return db.query("SELECT * FROM topics").then((response) => {
    return response.rows;
  });
};

exports.fetchedArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      GROUP BY comments.article_id, articles.article_id
      ORDER BY created_at DESC;`
    )
    .then((response) => {
      return response.rows;
    });
};
