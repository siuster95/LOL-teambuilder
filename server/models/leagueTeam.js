const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let leagueTeamModel = {};

// mongoose.Types.ObjectID is a function that converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const leagueTeamSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  name:{
    type: String,
    trim:true,
    unique:true,
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
    type:String,
    trim: true,
    default: null,
  },
    
  Count: {
      type:Number,
  }
  
  createData: {
    type: Date,
    default: Date.now(),
  },
});

leagueTeamSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

leagueTeamSchema.statics.findAll = (callback) => {

  return leagueTeamModel.find().exec(callback);
};

leagueTeamSchema.statics.findOneTeam = (teamname,callback) => {
  
    let querystring = {name : teamname};
    
    return leagueTeamModel.findOne(querystring).exec(callback);
};

leagueTeamSchema.statics.delete = (id, name, callback) => {
  const search = {
    owner: convertID(id),
    name,
  };
  return leagueTeamSchema.deleteOne(search).exec(callback);
};


leagueTeamSchema.statics.change = ( req, teamname, callback) => {
  const search = {
    name: teamname,
  };

  const change = {};
  const set = {};
  const inc = {};

switch (req.session.account.Role) {
    case "Top":
        set.Top = req.session.account.username;
        break;
    case "Jungle":
        set.Jungle = req.session.account.username;
        break;
    case "Mid":
        set.Mid = req.session.account.username;
        break;
    case "ADC":
        set.Jungle = req.session.account.username;
        break;
    case "Support":
        set.Support = req.session.account.username;
        break;
    default:
    console.log("No Role for some reason");
}

  inc.Count = 1;
  change.$set = set;
  change.$inc = inc;
  return leagueTeamModel.update(search, change).exec(callback);
};

leagueTeamSchema.statics.leave = (req, teamname, callback) => {

    const filter = {
        name: teamname,
    };
    const update = {};
    switch (req.session.account.Role) {
        case "Top":
            update.Top = "";
            break;
        case "Jungle":
            update.Jungle = "";
            break;
        case "Mid":
            update.Mid = "";
            break;
        case "ADC":
            update.ADC = "";
            break;
        case "Support":
            update.Support = "";
            break;
        default:
        console.log("No Role for some reason");  
    }
    
    return leagueTeamModel.findOneAndUpdate(filter,update).exec(callback);
    
};

leagueTeamModel = mongoose.model('leagueTeam', leagueTeamSchema);

module.exports.leagueTeamModel = leagueTeamModel;
module.exports.leagueTeamSchema = leagueTeamSchema;
