const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// const _ = require('underscore');

let LeagueTeamModel = {};

// mongoose.Types.ObjectID is a function that converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;
// const setName = (name) => _.escape(name).trim();

const leagueTeamSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  name: {
    type: String,
    trim: true,
    unique: true,
  },
  Top: {
    type: String,
    trim: true,
    default: null,
  },

  Jungle: {
    type: String,
    trim: true,
    default: null,
  },

  Mid: {
    type: String,
    trim: true,
    default: null,
  },

  ADC: {
    type: String,
    trim: true,
    default: null,
  },

  Support: {
    type: String,
    trim: true,
    default: null,
  },

  TopChamp: {
    type: String,
    default: null,
  },

  JungleChamp: {
    type: String,
    default: null,
  },

  MidChamp: {
    type: String,
    default: null,
  },

  ADCChamp: {
    type: String,
    default: null,
  },

  SupportChamp: {
    type: String,
    default: null,
  },

  Count: {
    type: Number,
  },

  Rank: {
    type: String,
  },

  createData: {
    type: Date,
    default: Date.now(),
  },
});

leagueTeamSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

leagueTeamSchema.statics.findAll = (Rank, callback) => {
  const search = {
    Rank,
  };

  LeagueTeamModel.find(search).exec(callback);
};

leagueTeamSchema.statics.findOneTeam = (teamname, callback) => {
  const querystring = { name: teamname };

  return LeagueTeamModel.findOne(querystring).exec(callback);
};

leagueTeamSchema.statics.delete = (id, name, callback) => {
  const search = {
    owner: convertID(id),
    name,
  };
  return leagueTeamSchema.deleteOne(search).exec(callback);
};


leagueTeamSchema.statics.change = (req, teamname, callback) => {
  const search = {
    name: teamname,
  };

  const change = {};
  const set = {};
  const inc = {};

  switch (req.session.account.Role) {
    case 'Top':
      set.Top = req.session.account.username;
      break;
    case 'Jungle':
      set.Jungle = req.session.account.username;
      break;
    case 'Mid':
      set.Mid = req.session.account.username;
      break;
    case 'ADC':
      set.ADC = req.session.account.username;
      break;
    case 'Support':
      set.Support = req.session.account.username;
      break;
    default:
      console.log('No Role for some reason');
  }

  inc.Count = 1;
  change.$set = set;
  change.$inc = inc;
  return LeagueTeamModel.update(search, change).exec(callback);
};

leagueTeamSchema.statics.leave = (req, teamname, callback) => {
  const filter = {
    name: teamname,
  };
  const update = {};
  switch (req.session.account.Role) {
    case 'Top':
      update.Top = null;
      update.TopChamp = null;
      break;
    case 'Jungle':
      update.Jungle = null;
      update.JungleChamp = null;
      break;
    case 'Mid':
      update.Mid = null;
      update.MidChamp = null;
      break;
    case 'ADC':
      update.ADC = null;
      update.ADCChamp = null;
      break;
    case 'Support':
      update.Support = null;
      update.SupportChamp = null;
      break;
    default:
      console.log('No Role for some reason');
  }
  update.$inc = { Count: -1 };
  return LeagueTeamModel.findOneAndUpdate(filter, update).exec(callback);
};

leagueTeamSchema.statics.addChamp = (req, teamname, Champ, callback) => {
  const filter = {
    name: teamname,
  };
  const update = {};
  if (Champ !== 'No Change') {
    switch (req.session.account.Role) {
      case 'Top':
        update.TopChamp = Champ;
        break;
      case 'Jungle':
        update.JungleChamp = Champ;
        break;
      case 'Mid':
        update.MidChamp = Champ;
        break;
      case 'ADC':
        update.ADCChamp = Champ;
        break;
      case 'Support':
        update.SupportChamp = Champ;
        break;
      default:
        console.log('Error: account has no Role');
    }
  }

  return LeagueTeamModel.findOneAndUpdate(filter, update).exec(callback);
};

leagueTeamSchema.statics.removeAll = (callback) =>
    LeagueTeamModel.deleteMany({ Count: 0 }).exec(callback);
LeagueTeamModel = mongoose.model('leagueTeam', leagueTeamSchema);

module.exports.LeagueTeamModel = LeagueTeamModel;
module.exports.leagueTeamSchema = leagueTeamSchema;
