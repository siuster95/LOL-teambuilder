let teamjoinedname;
let role;
let rank;
let intervalId;
let ChangePWlink;
let MakeTeamlink;
let Logoutlink;
let errorMessage;
let usernameP;
let teamnameP;
let roleP;
let rankP;
let csrf;
let socket;
let username;
let textinput;
let chatbox;
let optionselect;
let teamsLookingfor;
let rankedBut;
let normalBut;
let RoleorRankLink;
let MatchType;

const handlePWChange = (e) => {
  e.preventDefault();
    
  sendAjax("POST", $("#ChangePWForm").attr("action"), $("#ChangePWForm").serialize(), (result) => {
     
    
        if(intervalId == -1)
        {
            intervalId = setInterval(loadTeamsFromServer, 1000); 
        }
      
      loadTeamsFromServer();
      
        normalBut.style.display = "inline";
        rankedBut.style.display = "inline";
      
  });
  return false;
};

const handleRoleorRankChange = (e) => {
    e.preventDefault();
    
    sendAjax("POST", $("#ChangeRoleorRankForm").attr("action"), $("#ChangeRoleorRankForm").serialize(), result => {
            
    if(result.Role != "NoChange")
    {
      role = result.Role;
      roleP.innerHTML = "Role: " + result.Role;
    }
      
    if(result.Rank != "NoChange")
    {
        rank = result.Rank;
        rankP.innerHTML = "Rank: " + result.Rank;
    }
    
    if(intervalId == -1)
    {
        intervalId = setInterval(loadTeamsFromServer, 1000); 
    }
      
      loadTeamsFromServer();
        
    });
    
    normalBut.style.display = "inline";
    rankedBut.style.display = "inline";
    
}

const handleleagueTeam = (e) => {
    e.preventDefault();
    
    let teamname = $("#TeamName").val();
    teamjoinedname = $("#TeamName").val();
    
    let csrf = $("#cs").val();
    
    
    
    sendAjax("POST", $("#leagueForm").attr("action"), $("#leagueForm").serialize(), (returnvalue) => {
        
        
        ChangePWlink.style.display = "none";
        MakeTeamlink.style.display = "none";
        Logoutlink.style.display = "none";
        RoleorRankLink.style.display = "none";
        MatchType.style.display = "none";
        
        if(intervalId == -1)
        {
            intervalId = setInterval(loadSpecificTeamsFromServer, 1000); 
        }
        
        loadSpecificTeamsFromServer();
        
        teamnameP.innerHTML = "Teamname: " + teamjoinedname;
        
        socket.emit("makeTeam",{name: username, team: teamjoinedname});
  });
    
    return false;   
};

const cancel = () => {
    
        normalBut.style.display = "inline";
        rankedBut.style.display = "inline";
    
        if(intervalId == -1)
        {
            intervalId = setInterval(loadTeamsFromServer, 1000); 
        }
    
    loadTeamsFromServer();
};

const LeagueTeamMaker = (e) => {

    for(let x = intervalId; x > 0; x--)
    {
        clearInterval(x);
    }
    intervalId = -1;
    
    const Maker = () => {
        return (
        <form id="leagueForm" onSubmit = {handleleagueTeam} name="leagueForm" action="/maketeam" method="POST" >
        <label htmlFor="name">Name of Team: </label>
        <input id="TeamName" type="text" name="name" placeholder="Team Name"/>
        <input  id="cs" type="hidden" name="_csrf" value={csrf} />
        <input className="formButton" type="button" id="TeamMakeCancel" value="Cancel" onClick = {(e) => cancel() }/>
        <input  id="TeamMakeSubmit" className="formButton" type="submit" value="Make Team"/>
        <label id="rankLabel" htmlFor="rank">Rank: </label>
         <select id="rank" name="rank">
                <option value="Ranked">Ranked</option>
                <option value="Normal">Normal</option>
            </select>
        </form>
        );
    };
    
    ReactDOM.render(
            <Maker/>, document.querySelector("#leagueTeamgroup")   
       ); 
    
    
    
}

const join = (e, teamname) => {
    e.preventDefault();
    
    for(let x = intervalId; x > 0; x--)
    {
        clearInterval(x);
    }
    intervalId = -1;
        
    teamjoinedname = teamname;
    
    let data = `teamname=${teamname}&_csrf=${csrf}`;
    
     sendAjax("POST", "/jointeam", data ,() => {
     
         
        ChangePWlink.style.display = "none";
        MakeTeamlink.style.display = "none";
        Logoutlink.style.display = "none";
        RoleorRankLink.style.display = "none";
        normalBut.style.display = "none";
        rankedBut.style.display = "none";
        MatchType.style.display = "none";
         
        if(intervalId == -1)
        {
            intervalId = setInterval(loadSpecificTeamsFromServer, 1000); 
        }  
         
        loadSpecificTeamsFromServer();
    
        teamnameP.innerHTML = "teamname: " + teamjoinedname;
         
        socket.emit("jointeam",{team:teamjoinedname, name:username});
         
  });
    

  return false;   
};

const leave = (e, teamname) => {
    
      let data = `teamname=${teamname}&_csrf=${csrf}`; 
    sendAjax("POST", "/leaveTeam", data, () => {
        for(let x = intervalId; x > 0; x--)
        {
            clearInterval(x);
        }
        
        intervalId = -1;
        ChangePWlink.style.display = "inline";
        MakeTeamlink.style.display = "inline";
        Logoutlink.style.display = "inline";
        RoleorRankLink.style.display = "inline";
        normalBut.style.display = "inline";
        rankedBut.style.display = "inline";
        MatchType.style.display = "block";
        teamnameP.innerHTML = "Teamname:";
        socket.emit("leaveteam",{}); 
        teamjoinedname = "";
        
        textinput = undefined;
        chatbox = undefined;
        
        
        
        if(intervalId == -1)
        {
            intervalId = setInterval(loadTeamsFromServer, 1000); 
        }
            /*
            ReactDOM.render(
                <LeagueList leagueteams={data.teams} />, document.querySelector("#leagueTeamgroup")   ); */
            
            loadTeamsFromServer();
             
   });
};

const LeagueList = (props) => {  
  if(props.leagueteams.length === 0) {
      return(
        <div className="leagueList">
            <h3 id="EmptyList">No Teams yet</h3>  
        </div>
      );
  }
    
  const teamNodes = props.leagueteams.map(function(leagueteam) {
     return (
         <div className="leagueList">
         <table >
             <caption>Name of Team: {leagueteam.name}</caption>
             <tr>
                <th>Role</th>
                <th>Username</th>
             </tr>
             <tr>
                <td>Top:</td>
                <td>{leagueteam.Top}</td>
             </tr>
             <tr>
                 <td>Jungle:</td>
                 <td>{leagueteam.Jungle}</td>
             </tr>
             <tr>
                <td>Mid:</td>
                <td>{leagueteam.Mid}</td>
             </tr>
             <tr>
                <td>ADC:</td>
                <td>{leagueteam.ADC}</td>
             </tr>
             <tr>
                <td>Support:</td>
                <td>{leagueteam.Support}</td>
             </tr>
         </table>
         { leagueteam[role] == null &&
         <button className="formButton" onClick={ (e) => join(e, leagueteam.name) }>Join</button>
         }
         </div>
     ); 
  });
    
    return (
        <div class="leagueList">
            {teamNodes}
        </div>
    );
};

const SpecificLeagueList = (props) => {
    /*
  if(props.leagueteams.length === 0) {
      return(
        <div className="leagueList">
            <h3 className="emptyDomo">No Teams yet</h3>  
        </div>
      );
  }*/
    
     return (
        <div class="leagueList">
     
        <div className="leagueList">
         <table>
             <caption>Name of Team: {props.leagueteam.name}</caption>
             <tr>
                <th>Role</th>
                <th>Username</th>
                <th>Champs</th>
             </tr>
             <tr>
                <td>Top:</td>
                <td>{props.leagueteam.Top}</td>
                <td>{props.leagueteam.TopChamp}</td>
             </tr>
             <tr>
                 <td>Jungle:</td>
                 <td>{props.leagueteam.Jungle}</td>
                 <td>{props.leagueteam.JungleChamp}</td>
             </tr>
             <tr>
                <td>Mid:</td>
                <td>{props.leagueteam.Mid}</td>
                <td>{props.leagueteam.MidChamp}</td>
             </tr>
             <tr>
                <td>ADC:</td>
                <td>{props.leagueteam.ADC}</td>
                <td>{props.leagueteam.ADCChamp}</td>
             </tr>
             <tr>
                <td>Support:</td>
                <td>{props.leagueteam.Support}</td>
                <td>{props.leagueteam.SupportChamp}</td>
             </tr>
             
         </table>
         <button className="formButton" onClick={ (e) => leave(e,props.leagueteam.name) }>Leave</button>
            
         <div>
         <label id="TextInputLabel" htmlFor="TextInput">Message: </label>
         <input id="MsgInput" type="text" name="TextInput" placeholder="Message here"/>
         <button id="SendButton" className="formButton" onClick={ (e) => SendMsgtoServer(e)}>Send</button>
         </div>
             
         <div>
            <label id="ChampSelectLabel" htmlFor="ChampSelect">Champ: </label>    
            <select id="ChampSelect" name="ChampSelect">
                <option value="No Change">No Change</option>
                <option value="Aatrox">Aatrox</option>
                <option value="Ahri">Ahri</option>
                <option value="Amumu">Amumu</option>
                <option value="Anivia">Anivia</option>
                <option value="Ashe">Ashe</option>
                <option value="Aurelion Sol">Aurelion Sol</option>
                <option value="Azir">Azir</option>
                <option value="Bard">Bard</option>
                <option value="Blitzcrank">Blitzcrank</option>
                <option value="Brand">Brand</option>
                <option value="Braum">Braum</option>
                <option value="Caitlyn">Caitlyn</option>
                <option value="Camille">Camille</option>
                <option value="Cho'gath">Cho'gath</option>
                <option value="Corki">Corki</option>
                <option value="Darius">Darius</option>
                <option value="Diana">Diana</option>
                <option value="Dr.Mundo">Dr.Mundo</option>
                <option value="Draven">Draven</option>
                <option value="Ekko">Ekko</option>
                <option value="Elise">Elise</option>
                <option value="Evelynn">Evelynn</option>
                <option value="Ezreal">Ezreal</option>
                <option value="Fiddlesticks">Fiddlesticks</option>
                <option value="Fiora">Fiora</option>
                <option value="Fizz">Fizz</option>
                <option value="Galio">Galio</option>
                <option value="Gangplank">Gangplank</option>
                <option value="Garen">Garen</option>
                <option value="Gnar">Gnar</option>
                <option value="Gragas">Gragas</option>
                <option value="Graves">Graves</option>
                <option value="Hecarim">Hecarim</option>
                <option value="Heimerdinger">Heimerdinger</option>
                <option value="Illaoi">Illaoi</option>
                <option value="Irelia">Irelia</option>
                <option value="Ivern">Ivern</option>
                <option value="Janna">Janna</option>
                <option value="Jarven 4th">Jarven 4th</option>
                <option value="Jax">Jax</option>
                <option value="Jayce">Jayce</option>
                <option value="Jhin">Jhin</option>
                <option value="Jinx">Jinx</option>
                <option value="Kalista">Kalista</option>
                <option value="Karma">Karma</option>
                <option value="Karthus">Karthus</option>
                <option value="Kassadin">Kassadin</option>
                <option value="Katarina">Katarina</option>
                <option value="Kayle">Kayle</option>
                <option value="Kayn">Kayn</option>
                <option value="Kennen">Kennen</option>
                <option value="Kha'Zix">Kha'Zix</option>
                <option value="Kindred">Kindred</option>
                <option value="Kled">Kled</option>
                <option value="Kog'Maw">Kog'Maw</option>
                <option value="LeBlanc">LeBlanc</option>
                <option value="Lee Sin">Lee Sin</option>
                <option value="Leona">Leona</option>
                <option value="Lissandra">Lissandra</option>
                <option value="Lucian">Lucian</option>
                <option value="Lulu">Lulu</option>
                <option value="Lux">Lux</option>
                <option value="Malphite">Malphite</option>
                <option value="Malzahar">Malzahar</option>
                <option value="Maokai">Maokai</option>
                <option value="Master Yi">Master Yi</option>
                <option value="Miss Fortune">Miss Fortune</option>
                <option value="Mordekaiser">Mordekaiser</option>
                <option value="Morgana">Morgana</option>
                <option value="Nami">Nami</option>
                <option value="Nasus">Nasus</option>
                <option value="Nautilus">Nautilus</option>
                <option value="Nidalee">Nidalee</option>
                <option value="Nocturne">Nocturne</option>
                <option value="Nunu">Nunu</option>
                <option value="Olaf">Olaf</option>
                <option value="Orianna">Orianna</option>
                <option value="Ornn">Ornn</option>
                <option value="Pantheon">Pantheon</option>
                <option value="Poppy">Poppy</option>
                <option value="Quinn">Quinn</option>
                <option value="Rakan">Rakan</option>
                <option value="Rammus">Rammus</option>
                <option value="Rek'Sai">Rek'Sai</option>
                <option value="Renekton">Renekton</option>
                <option value="Rengar">Rengar</option>
                <option value="Riven">Riven</option>
                <option value="Rumble">Rumble</option>
                <option value="Ryze">Ryze</option>
                <option value="Sejuani">Sejuani</option>
                <option value="Shaco">Shaco</option>
                <option value="Shen">Shen</option>
                <option value="Shyvana">Shyvana</option>
                <option value="Singed">Singed</option>
                <option value="Sion">Sion</option>
                <option value="Sivir">Sivir</option>
                <option value="Skarner">Skarner</option>
                <option value="Sona">Sona</option>
                <option value="Swain">Swain</option>
                <option value="Syndra">Syndra</option>
                <option value="Tahm Kench">Tahm Kench</option>
                <option value="Taliyah">Taliyah</option>
                <option value="Talon">Talon</option>
                <option value="Taric">Taric</option>
                <option value="Thresh">Thresh</option>
                <option value="Tristana">Tristana</option>
                <option value="Trundle">Trundle</option>
                <option value="Tryndamere">Tryndamere</option>
                <option value="Twisted Fate">Twisted Fate</option>
                <option value="Twitch">Twitch</option>
                <option value="Udyr">Udyr</option>
                <option value="Urgot">Urgot</option>
                <option value="Varus">Varus</option>
                <option value="Vayne">Vayne</option>
                <option value="Veigar">Veigar</option>
                <option value="Vel'Koz">Vel'Koz</option>
                <option value="Vi">Vi</option>
                <option value="Viktor">Viktor</option>
                <option value="Vladimir">Vladimir</option>
                <option value="Volibear">Volibear</option>
                <option value="Warwick">Warwick</option>
                <option value="Wukong">Wukong</option>
                <option value="Xayah">Xayah</option>
                <option value="Xerath">Xerath</option>
                <option value="Xin Zhao">Xin Zhao</option>
                <option value="Yasuo">Yasuo</option>
                <option value="Yorick">Yorick</option>
                <option value="Zac">Zac</option>
                <option value="Zed">Zed</option>
                <option value="Ziggs">Ziggs</option>
                <option value="Zilean">Zilean</option>
                <option value="Zoe">Zoe</option>
                <option value="Zyra">Zyra</option>
            </select>
            <button id="ChampSubmitButton" className="formButton" onClick={(e) => SendChamptoServer(e)}>Submit</button>
        <label id="ChatLabel" htmlFor="Chat">Chat: </label>
         <textarea rows="4" cols="50" id="Chatbox" type="text" name="Chat">
         </textarea>
         </div>
             
        
       </div>
    </div>
    );
};

const SendMsgtoServer = (e) => {
    e.preventDefault();
    //send msg and name to server
    let message = textinput.value;
    socket.emit("msgToServer", {name:username, msg: message});
    textinput.value = "";
};

const SendChamptoServer = (e) => {
    e.preventDefault();
    let Champ = optionselect.options[optionselect.selectedIndex].value;
    let data = `teamname=${teamjoinedname}&_csrf=${csrf}&Champ=${Champ}`; 
    
    sendAjax("POST", "/selectChamp", data, () => {
        
    });
}


const loadTeamsFromServer = () => {
    
    console.log(intervalId);
    
    if(intervalId < 0)
    {
        return;
    }
    
    let dataIn;
    
    if(teamsLookingfor == "Normal")
    {
        dataIn = `rank=Normal&_csrf=${csrf}`;
    }
    else if(teamsLookingfor == "Ranked")
    {
        dataIn = `rank=Ranked&_csrf=${csrf}`;
    }
    
    sendAjax("POST", "/getTeams", dataIn, (data) => {
       ReactDOM.render(
          <LeagueList leagueteams={data.teams} />, document.querySelector("#leagueTeamgroup")  
       ); 
    });
}

const loadSpecificTeamsFromServer = () => {
    
    if(intervalId < 0)
    {
        return;
    }
    
    let dataIn = `name=${teamjoinedname}&_csrf=${csrf}`;
    
    sendAjax("POST", "/oneTeam", dataIn, (data) => {
       ReactDOM.render(
          <SpecificLeagueList leagueteam={data.teams} />, document.querySelector("#leagueTeamgroup")
       );
            
        
             
    grabInTeamcomponents();
    
        
    });
}



const setup = function(csrfin) {
    
    csrf = csrfin;
    
    //show the list
    ReactDOM.render(
        <LeagueList  leagueteams={[]} />, document.querySelector("#leagueTeamgroup")
    );
    
    //grab the list
    
    
        if(intervalId == -1)
        {
            intervalId = setInterval(loadTeamsFromServer, 1000); 
        }
    
    loadTeamsFromServer();
   
   ChangePWlink.addEventListener("click", (e) => {
        normalBut.style.display = "none";
        rankedBut.style.display = "none";
       onChangePWclick();
   });
   MakeTeamlink.addEventListener("click", (e) => {
       normalBut.style.display = "none";
       rankedBut.style.display = "none";
       LeagueTeamMaker(e)
   });
   normalBut.addEventListener("click", (e) => {
       teamsLookingfor = "Normal";
       MatchType.innerHTML = "Match Type: " + teamsLookingfor;
   });
   rankedBut.addEventListener("click", (e) => {
        teamsLookingfor = "Ranked";
        MatchType.innerHTML = "Match Type: " + teamsLookingfor;
   });
   RoleorRankLink.addEventListener("click", (e) => {
        normalBut.style.display = "none";
        rankedBut.style.display = "none";
        onRoleorRankclick();
   });
};

const onChangePWclick = () => {
    
    for(let x = intervalId; x > 0; x--)
    {
        clearInterval(x);
    }
    intervalId = -1;
    
    let PWChange = () => { 
        return (
    <form id="ChangePWForm" name="ChangePWForm" onSubmit = {handlePWChange} action="/ChangePW" method="POST">
    <label id="passCLabel" htmlFor="passC">New Password: </label>
    <input id="passC" type="password" name="passC" placeholder="password"/>
    <label id="pass2CLabel" htmlFor="pass2C">New Password again: </label>
    <input id="pass2C" type="password" name="pass2C" placeholder="password Again"/>
    <input type="hidden" name="_csrf" value={csrf}/>
    <input id="ChangePWSubmit" className="formButton" type="submit" value="Submit"/>
    <input id="ChangePWCancel" onClick = {(e) => cancel() } className="formButton" type="button" value="Cancel"/>
    </form>
    );
    };
    
    ReactDOM.render(
    <PWChange/>, document.querySelector("#leagueTeamgroup") 
    );
};

const onRoleorRankclick = () => {
    
      for(let x = intervalId; x > 0; x--)
      {
          clearInterval(x);
      }
      intervalId = -1;
    
      let RoleorRankChange = () => {
      return(
      <form id="ChangeRoleorRankForm" name="ChangeRoleorRankForm" onSubmit = {handleRoleorRankChange} action="/ChangeRR" method="POST">
      <label id="roleCLabel" name="roleC">Role: </label>
      <select id="roleC" name="roleC">
        <option value="NoChange">No Change</option>
        <option value="Top">Top</option>
        <option value="Jungle">Jungle</option>
        <option value="Mid">Mid</option>
        <option value="ADC">ADC</option>
        <option value="Support">Support</option>
    </select>
    <label id="rankCLabel" htmlFor="rankC">Rank: </label>
    <select id="rankC" name="rankC">
        <option value="NoChange">No Change</option>
        <option value="Bronze">Bronze</option>
        <option value="Silver">Silver</option>
        <option value="Gold">Gold</option>
        <option value="Platinum">Platinum</option>
        <option value="Diamond">Diamond</option>
        <option value="Master">Master</option>
        <option value="Challenger">Challenger</option>
    </select>
    <input type="hidden" name="_csrf" value={csrf}/>
    <input id="ChangeRRSubmit" className="formButton" type="submit" value="Submit"/>
    <input id="ChangeRRCancel" onClick = {(e) => cancel() } className="formButton" type="button" value="Cancel"/>
    </form>
     );
      };
    
     ReactDOM.render(
    <RoleorRankChange/>, document.querySelector("#leagueTeamgroup") 
    );
};

const getToken = () => {
  sendAjax("GET", "/getToken", null, (result) => {
     setup(result.csrfToken); 
  });  
};

const getRole = () => {
    sendAjax("GET", "/getRole", null, (result) => {
        role = result.role;
        usernameP.innerHTML = "Username: " + result.name;
        username = result.name;
        roleP.innerHTML = "Role: " + result.role;
        rank = result.rank;
        rankP.innerHTML = "Rank: " + result.rank;
    });
}

const grabInTeamcomponents = () => {
    textinput = document.querySelector("#MsgInput");
    chatbox = document.querySelector("#Chatbox");  
    optionselect = document.querySelector("#ChampSelect");
};

$(document).ready(function() {
   intervalId = -1;
   ChangePWlink = document.querySelector("#ChangePW");
   MakeTeamlink = document.querySelector("#makeTeam");
   Logoutlink = document.querySelector("#logout");    
   usernameP = document.querySelector("#username");
   teamnameP = document.querySelector("#teamname");
   roleP = document.querySelector("#role");
   rankP = document.querySelector("#Currentrank");
   errorMessage = document.querySelector("#errorMessage");
   normalBut = document.querySelector("#normalBut");
   rankedBut = document.querySelector("#rankedBut");
   RoleorRankLink = document.querySelector("#ChangeRoleorRank");
   MatchType = document.querySelector("#MatchType");
   getToken(); 
   getRole();
   teamsLookingfor = "Normal";
   MatchType.innerHTML = "Match Type: " + teamsLookingfor;
   socket = io.connect();
   socket.on("joined", () => {
      console.log("connected on socket io");
   });
    
   socket.on("msg", (data) => {
       let message = `${data.name} said: ${data.msg} \n`;
       chatbox.value += message;
   });

});