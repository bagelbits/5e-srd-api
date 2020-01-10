const AbilityScore = require('../../models/abilityScore');
const utility = require('./utility');

exports.index = (req, res, next) => {
  const search_queries = {};
  if (req.query.name !== undefined) {
    search_queries.name = req.query.name;
  }

  AbilityScore.find(search_queries, (err, _data) => {
    if (err) {
      next(err);
    }
  })
    .sort({ index: 'asc' })
    .exec((err, data) => {
      if (err) {
        next(err);
      }
      res.status(200).json(utility.NamedAPIResource(data));
    });
};

exports.show = (req, res, next) => {
  AbilityScore.findOne({ index: req.params.index }, (err, data) => {
    if (err) {
      next(err);
    }

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });
};