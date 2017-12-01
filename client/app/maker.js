let teamjoinedname;
let role;
let intervalId;
let ChangePWlink;
let MakeTeamlink;
let Logoutlink;
let errorMessage;
let usernameP;
let teamnameP;
let roleP;
let csrf;

const handlePWChange = (e) => {
  e.preventDefault();
    
  sendAjax("POST", $("#ChangePWorRoleForm").attr("action"), $("#ChangePWorRoleForm").serialize(), (result) => {
      
      if(result.Role != "NoChange")
    {
      role = result.Role;
      roleP.innerHTML = "role: " + result.Role;
    }
      loadTeamsFromServer();
    
        if(intervalId == -1)
        {
            intervalId = setInterval(loadTeamsFromServer, 50); 
        }
      
  });
  return false;
};

const handleleagueTeam = (e) => {
    e.preventDefault();
    
    let teamname = $("#TeamName").val();
    teamjoinedname = $("#TeamName").val();
    
    let csrf = $("#cs").val();
    
    
    
    sendAjax("POST", $("#leagueForm").attr("action"), $("#leagueForm").serialize(), (returnvalue) => {
        loadSpecificTeamsFromServer();
        
        ChangePWlink.style.display = "none";
        MakeTeamlink.style.display = "none";
        Logoutlink.style.display = "none";
        
        if(intervalId == -1)
        {
            intervalId = setInterval(loadSpecificTeamsFromServer, 50); 
        }
        
        teamnameP.innerHTML = "teamname: " + teamjoinedname;
  });
    
    return false;   
};

const cancel = () => {
    
        loadTeamsFromServer();
    
        if(intervalId == -1)
        {
            intervalId = setInterval(loadTeamsFromServer, 50); 
        }
};

const LeagueTeamMaker = (e) => {

    clearInterval(intervalId);
    intervalId = -1;
    
    const Maker = () => {
        return (
        <form id="leagueForm" onSubmit = {handleleagueTeam} name="leagueForm" action="/maketeam" method="POST" >
        <label htmlFor="name">Name of Team: </label>
        <input id="TeamName" type="text" name="name" placeholder="Team Name"/>
        <input  id="cs" type="hidden" name="_csrf" value={csrf} />
        <input className="formButton" type="button" id="TeamMakeCancel" value="Cancel" onClick = {(e) => cancel() }/>
        <input  id="TeamMakeSubmit" className="formButton" type="submit" value="Make Team"/>
        </form>
        );
    };
    
    ReactDOM.render(
            <Maker/>, document.querySelector("#leagueTeamgroup")   
       ); 
    
    
    
}

const join = (e, teamname) => {
    e.preventDefault();
    
    clearInterval(intervalId);
    intervalId = -1;
        
    teamjoinedname = teamname;
    
    let data = `teamname=${teamname}&_csrf=${csrf}`;
    
     sendAjax("POST", "/jointeam", data ,() => {
     loadSpecificTeamsFromServer();
         
        ChangePWlink.style.display = "none";
        MakeTeamlink.style.display = "none";
        Logoutlink.style.display = "none";
         
        if(intervalId == -1)
        {
            intervalId = setInterval(loadSpecificTeamsFromServer, 50); 
        }  
    
        teamnameP.innerHTML = "teamname: " + teamjoinedname;
         
  });
    

  return false;   
};

const leave = (e, teamname) => {
    
      let data = `teamname=${teamname}&_csrf=${csrf}`; 
    sendAjax("POST", "/leaveTeam", data, () => {
        clearInterval(intervalId);
        intervalId = -1;
        sendAjax("GET", "/getTeams", null, (data) => {
            
        ChangePWlink.style.display = "inline";
        MakeTeamlink.style.display = "inline";
        Logoutlink.style.display = "inline";
        
        teamnameP.innerHTML = "teamname:";
            
        if(intervalId == -1)
        {
            intervalId = setInterval(loadTeamsFromServer, 50); 
        }
            ReactDOM.render(
                <LeagueList leagueteams={data.teams} />, document.querySelector("#leagueTeamgroup")  
                
       ); 
     }); 
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
  if(props.leagueteams.length === 0) {
      return(
        <div className="leagueList">
            <h3 className="emptyDomo">No Teams yet</h3>  
        </div>
      );
  }
    
  const teamNodes = props.leagueteams.map(function(leagueteam) {
     if(leagueteam.name == teamjoinedname)
    {
     return (
        <div className="leagueList">
         <table>
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
         <button className="formButton" onClick={ (e) => leave(e,leagueteam.name) }>Leave</button>
       </div>
     );
    }
  });
    
    return (
        <div class="leagueList">
            {teamNodes}
        </div>
    );
};


const loadTeamsFromServer = () => {
    
    console.log(intervalId);
    
    if(intervalId < 0)
    {
        return;
    }
    
    sendAjax("GET", "/getTeams", null, (data) => {
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
    
    sendAjax("GET", "/getTeams", null, (data) => {
       ReactDOM.render(
          <SpecificLeagueList leagueteams={data.teams} />, document.querySelector("#leagueTeamgroup")  
       ); 
    });
}



const setup = function(csrfin) {
    
    csrf = csrfin;
    
    //show the list
    ReactDOM.render(
        <LeagueList  leagueteams={[]} />, document.querySelector("#leagueTeamgroup")
    );
    
    //grab the list
    loadTeamsFromServer();
    
        if(intervalId == -1)
        {
            intervalId = setInterval(loadTeamsFromServer, 50); 
        }
    
   
   ChangePWlink.addEventListener("click", (e) => {
       onChangePWclick();
   });
   MakeTeamlink.addEventListener("click", (e) => {
       LeagueTeamMaker(e)
   });
};

const onChangePWclick = () => {
    
    clearInterval(intervalId);
    intervalId = -1;
    
    let PWChange = (props) => { 
        return (
    <form id="ChangePWorRoleForm" name="ChangePWorRoleForm" onSubmit = {handlePWChange} action="/ChangePW" method="POST">
    <label id="passCLabel" htmlFor="passC">New Password: </label>
    <input id="passC" type="password" name="passC" placeholder="password"/>
    <label id="pass2CLabel" htmlFor="pass2C">New Password again: </label>
    <input id="pass2C" type="password" name="pass2C" placeholder="password Again"/>
    <label id="roleCLabel" htmlFor="roleC">Role: </label>
    <select id="roleC" name="roleC">
        <option value="NoChange">No Change</option>
        <option value="Top">Top</option>
        <option value="Jungle">Jungle</option>
        <option value="Mid">Mid</option>
        <option value="ADC">ADC</option>
        <option value="Support">Support</option>
    </select>
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

const getToken = () => {
  sendAjax("GET", "/getToken", null, (result) => {
     setup(result.csrfToken); 
  });  
};

const getRole = () => {
    sendAjax("GET", "/getRole", null, (result) => {
        role = result.role;
        usernameP.innerHTML = "username: " + result.name;
        roleP.innerHTML = "role: " + result.role;
    });
}

$(document).ready(function() {
   intervalId = -1;
   ChangePWlink = document.querySelector("#ChangePW");
   MakeTeamlink = document.querySelector("#makeTeam");
   Logoutlink = document.querySelector("#logout");    
   usernameP = document.querySelector("#username");
   teamnameP = document.querySelector("#teamname");
   roleP = document.querySelector("#role");
   errorMessage = document.querySelector("#errorMessage");
   getToken(); 
   getRole();

});