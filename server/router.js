const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.post('/getTeams', mid.requiresSecure, mid.requiresLogin, controllers.leagueTeam.getTeams);
  app.post('/oneTeam', mid.requiresSecure, mid.requiresLogin, controllers.leagueTeam.getOneteam);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  // app.post('/delete', mid.requiresSecure, mid.requiresLogin, controllers.Domo.delete);
  // app.post('/change', mid.requiresSecure, mid.requiresLogin, controllers.Domo.edit);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresSecure, mid.requiresLogin, controllers.Account.logout);
  app.post('/ChangePW', mid.requiresSecure, mid.requiresLogin, controllers.Account.ChangePW);
  app.get('/maker', mid.requiresSecure, mid.requiresLogin, controllers.leagueTeam.makerPage);
  app.post('/maketeam', mid.requiresSecure, mid.requiresLogin, controllers.leagueTeam.maketeam);
  app.post('/jointeam', mid.requiresSecure, mid.requiresLogin, controllers.leagueTeam.jointeam);
  app.post('/leaveTeam', mid.requiresSecure, mid.requiresLogin, controllers.leagueTeam.leave);
  app.get('/getRole', mid.requiresSecure, mid.requiresLogin, controllers.leagueTeam.role);
  app.post('/selectChamp', mid.requiresSecure, mid.requiresLogin, controllers.leagueTeam.SetChamp);
  app.post('/ChangeRR', mid.requiresSecure, mid.requiresLogin, controllers.Account.ChangeRR);
  // app.post('/maker', mid.requiresLogin, controllers.Domo.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('*', controllers.notFound);
};

module.exports = router;
