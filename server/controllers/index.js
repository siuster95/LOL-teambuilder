const path = require('path');

const notFound = (request, response) => {
  const res = response;
  return res.status(404).sendFile(path.join(`${__dirname} + /../../views/notFound.html`));
};

module.exports.notFound = notFound;
module.exports.Account = require('./Account.js');
module.exports.leagueTeam = require('./leagueTeam');

