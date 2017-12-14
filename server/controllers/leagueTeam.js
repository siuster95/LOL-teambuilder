const models = require('../models');

const LeagueTeam = models.leagueTeam;

const path = require('path');

const makerPage = (req, res) => res.sendFile(path.join(`${__dirname} + /../../views/app.html`));
const makeTeam = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Error: Name of team is required' });
  }

  const teamData = {

  };
  switch (req.session.account.Role) {
    case 'Top':
      teamData.Top = req.session.account.username;
      break;
    case 'Jungle':
      teamData.Jungle = req.session.account.username;
      break;
    case 'Mid':
      teamData.Mid = req.session.account.username;
      break;
    case 'ADC':
      teamData.ADC = req.session.account.username;
      break;
    case 'Support':
      teamData.Support = req.session.account.username;
      break;
    default:
      console.log('No Role for some reason');

  }

  teamData.name = req.body.name;
  teamData.owner = req.session.account._id;
  teamData.Count = 1;

  if (req.body.rank === 'Ranked') {
    teamData.Rank = req.session.account.Rank;
  } else if (req.body.rank === 'Normal') {
    teamData.Rank = 'Normal';
  }

  const newteam = new LeagueTeam.LeagueTeamModel(teamData);

  const teamPromise = newteam.save();

  teamPromise.then(() => res.json({ redirect: '/maker' })).catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Error: Team alreadly exists' });
    }

    return res.status(400).json({ error: 'Error: An error occurred' });
  });
  return teamPromise;
};


const getTeams = (request, response) => {
  // const req = request;
  const res = response;
  const req = request;
  let rank;

  if (req.body.rank === 'Normal') {
    rank = 'Normal';
  } else if (req.body.rank === 'Ranked') {
    rank = req.session.account.Rank;
  }

  return LeagueTeam.LeagueTeamModel.findAll(rank, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'Error: An error occurred' });
    }

    return res.json({ teams: docs });
  });
};

const getOneteam = (request, response) => {
  const req = request;
  const res = response;

  return LeagueTeam.LeagueTeamModel.findOneTeam(
req.body.name, (err, docs) =>
res.json({ teams: docs }));
};

const joinTeam = (request, response) => {
  const req = request;
  const res = response;

  return LeagueTeam.LeagueTeamModel.change(req, req.body.teamname, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'Error: An error occurred' });
    }

    return res.json({ Success: 'Someone has joined the team' });
  });
};

const leave = (request, response) => {
  const req = request;
  const res = response;

  return LeagueTeam.LeagueTeamModel.leave(req, req.body.teamname, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ data: 'Error: An error occurred' });
    }
    return LeagueTeam.LeagueTeamModel.removeAll(() => res.json({ data: 'Someone has left' }));
  });
};

const role = (request, response) => {
  const req = request;
  const res = response;

  return res.json({ role: req.session.account.Role,
    name: req.session.account.username,
    rank: req.session.account.Rank });
};

const SetChamp = (request, response) => {
  const req = request;
  const res = response;

  return LeagueTeam.LeagueTeamModel.addChamp(req, req.body.teamname, req.body.Champ, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'Error: An error occurred' });
    }

    return res.json({ Success: 'Someone has decided on a Champ' });
  });
};


module.exports.getTeams = getTeams;
module.exports.maketeam = makeTeam;
module.exports.jointeam = joinTeam;
module.exports.getOneteam = getOneteam;
module.exports.leave = leave;
module.exports.role = role;
module.exports.makerPage = makerPage;
module.exports.SetChamp = SetChamp;
