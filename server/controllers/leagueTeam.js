const models = require('../models');

const leagueTeam = models.leagueTeam;

const makerPage = (req, res) => {
  leagueTeam.leagueTeamModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken()});
  });
};

const makeTeam = (req,res) => {
  if(!req.body.name) {
      return res.status(400).json({error: "RAWR! Name of team is required"});
  }
    
  const teamData = {
      
  };
      switch (req.session.account.Role) {
          case "Top":
              teamData.Top = req.session.account.username;
              break;
          case "Jungle":
              teamData.Jungle = req.session.account.username;
              break;
          case "Mid":
              teamData.Mid = req.session.account.username;
              break;
          case "ADC":
              teamData.Jungle = req.session.account.username;
              break;
          case "Support":
              teamData.Support = req.session.account.username;
              break;
          default:
              console.log("No Role for some reason");
          
      }
    
    teamData.name = req.body.name;
    teamData.owner = req.session.account._id;
    teamData.Count = 1;
    const newteam = new leagueTeam.leagueTeamModel(teamData);
  
    const teamPromise = newteam.save();
    
    teamPromise.then(() => res.json({redirect: '/maker'}));
    
    teamPromise.catch((err) => {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({error: "Team alreadly exists"});
        }
        
        return res.status(400).json({error: "An error occurred"});
    });
    return teamPromise;
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.weight) {
    return res.status(400).json({ error: 'RAWR! name, age and weight are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    weight: req.body.weight,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo alreadly exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });
  return domoPromise;
};



const getTeams = (request, response) => {
  const req = request;
  const res = response;

  return leagueTeam.leagueTeamModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ teams: docs });
  });
};

const getOneteam = (request, response) => {
    const req = request;
    const res = response;
    
    return leagueTeam.leagueTeamModel.findOne(req.body.name,(err, docs) => {
    
        
    return res.json({teams: docs});
        
    });
    
};

const deleteDomo = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.delete(req.session.account._id, req.body.name, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ Success: 'The Domo was deleted' });
  });
};

const EditDomo = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.change(req.session.account._id, req.body.oldname,
  req.body.name, req.body.age, req.body.weight, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ Success: 'The Domo values were changed' });
  });
};

const joinTeam = (request, response) => {
  const req = request;
  const res = response;
    
  return leagueTeam.leagueTeamModel.change(req, req.body.teamname, (err) => {
      if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
      
    return res.json({ Success: 'Someone has joined the team' });
  });
};

const leave = (request, response) => {
  const req = request;
  const res = response;
    
  return leagueTeam.leagueTeamModel.leave(req, req.body.teamname, (err) => {
     if (err) {
         console.log(err);
         return res.status(400).json({data:"An error occurred"});
     }
     return res.json({data:"Someone has left"});
  });
};

const role = (request, response) => {
    const req = request;
    const res = response;
    
    return res.json({role: req.session.account.Role});
}



module.exports.makerPage = makerPage;
module.exports.getTeams = getTeams;
module.exports.make = makeDomo;
module.exports.delete = deleteDomo;
module.exports.edit = EditDomo;
module.exports.maketeam = makeTeam;
module.exports.jointeam = joinTeam;
module.exports.getOneteam = getOneteam; 
module.exports.leave = leave;
module.exports.role = role;
