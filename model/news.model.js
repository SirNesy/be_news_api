const db = require("../db/connection");

exports.selectedTopics = () => {
  return db.query("SELECT * FROM topics").then((res) => {
    return res.rows;
  });
};
