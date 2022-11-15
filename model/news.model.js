const db = require("../db/connection");

exports.selectedTopics = () => {
  return db.query("SELECT * FROM topics").then((response) => {
    return response.rows;
  });
};
