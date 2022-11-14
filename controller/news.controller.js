const { selectedTopics } = require("../model/news.model");

exports.getTopics = (req, res, next) => {
  selectedTopics()
    .then((result) => {
      res.status(200).send({ topics: result });
    })
    .catch(next);
};
