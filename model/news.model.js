const db = require("../db/connection");

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
