const models = require('../models');

const Account = models.Account;

const path = require('path');

const loginPage = (req, res) => res.sendFile(path.join(`${__dirname} + /../../views/login.html`));

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

    // force cast to string to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'Error: All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Error: Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

    // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;
  req.body.role = `${req.body.role}`;
  req.body.rank = `${req.body.rank}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2 || !req.body.role || !req.body.rank) {
    return res.status(400).json({ error: 'Error: All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Error: Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      Role: req.body.role,
      Rank: req.body.rank,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    }).catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Error: Username alreadly in use' });
      }

      return res.status(400).json({ error: 'Error: An error occurred' });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

const changePW = (request, response) => {
  const req = request;
  const res = response;


  if (req.body.passC !== req.body.pass2C) {
    return res.status(400).json({ error: 'Error: Both passwords have to match' });
  }


  // cast to string
  req.body.passC = `${req.body.passC}`;


  return Account.AccountModel.generateHash(req.body.passC, (salt, hash) => {
    const accountData = {
      salt,
      password: hash,
    };

    Account.AccountModel.changePW(req.session.account.username,
    req.body.passC, accountData, (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'Error: An error occurred' });
      }
      /*
      if (req.body.roleC !== 'NoChange') {
        req.session.account.Role = req.body.roleC;
      }

      if (req.body.rankC !== 'NoChange') {
          req.session.account.Rank = req.body.rankC;
      }
      */
      return res.json({ Role: req.body.roleC, Rank: req.body.rankC });
    });
  });
};

const changeRR = (request, response) => {
  const req = request;
  const res = response;

  Account.AccountModel.changeRR(req.session.account.username,
  req.body.roleC, req.body.rankC, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'Error: An error occurred' });
    }


    if (req.body.roleC !== 'NoChange') {
      req.session.account.Role = req.body.roleC;
    }

    if (req.body.rankC !== 'NoChange') {
      req.session.account.Rank = req.body.rankC;
    }


    return res.json({ Role: req.body.roleC, Rank: req.body.rankC });
  });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.ChangePW = changePW;
module.exports.ChangeRR = changeRR;
