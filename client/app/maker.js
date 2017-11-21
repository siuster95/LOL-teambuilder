let teamjoinedname;
let role;

const handleDomo = (e) => {
  e.preventDefault();
    
  $("#domoMessage").animate({width:"hide"},350);
    
  if($("#domoName").val() == "" || $("#domoAge").val() == "" || $("#domoWeight").val() =="") {
      handleError("RAWR! All fields are required");
      return false;
  }
    
  sendAjax("POST", $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
     loadDomosFromServer(); 
  });
    
    return false;
};

const handleleagueTeam = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:"hide"},350);
    
    let teamname = $("#TeamName").val();
    teamjoinedname = $("#TeamName").val();
    
    let csrf = $("#cs").val();
    
    if(teamname == ""){
      handleError("RAWR! All fields are required");
      return false;
    }
    
    
    
    sendAjax("POST", $("#leagueForm").attr("action"), $("#leagueForm").serialize(), (returnvalue) => {
        loadSpecificTeamsFromServer();
  });
    
    return false;   
};

const Delete = (e,name,id) => {
    e.preventDefault();

    let data;
    
    sendAjax("GET", "/getToken", null, (result) => {
        
    data = `name=${name}&id=${id}&_csrf=${result.csrfToken}`;
        
        
        sendAjax("POST", "/delete", data, () => {
        loadDomosFromServer(); 
        
    });


    });
      
    return false;
    
};

const Change = (e, Oldname, id) => {
    e.preventDefault();
    
    sendAjax("GET", "/getToken", null, (result) => {
        
        let name = document.querySelector("#domoIName").value;
        let age = document.querySelector("#domoIAge").value;
        let weight = document.querySelector("#domoIWeight").value;
        
        let data = `oldname=${Oldname}&name=${name}&age=${age}&weight=${weight}&id=${id}&_csrf=${result.csrfToken}`;
        
        sendAjax("POST", "/change", data, () => {
           loadDomosFromServer();
        });
        
        
    });
    
};

const EditDeleteButton = (e,name,age,weight,id) => {
    e.preventDefault();

    console.log(name);
    console.log(age);
    console.log(weight);
    console.log(id);
    

    ReactDOM.render(
        <EditDelete name={name} age={age} weight={weight} id={id} />, document.querySelector("#domos")
    );
};

const EditDelete = (props) => {
        console.log(props.weight);
        console.log(props.name);
        console.log(props.age);
        console.log(props.id);
        return (
            <div id="EditDomo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 id="NameLabel">Name: {props.name}</h3>
                <h3 id="AgeLabel">Age: {props.age}</h3>
                <h3 id="WeightDLabel">Weight: {props.weight}</h3>
                <label id="NameChangeLabel" htmlFor="name">Name: </label>
                <input id="domoIName" type="text" name="name" placeholder="Domo Name"/>
                <label id="AgeChangeLabel" htmlFor="age">Age: </label>
                <input id="domoIAge" type="text" name="age" placeholder="Domo Age"/>
                <label id="WeightChangeLabel" htmlFor="weight">Weight(in lbs): </label>
                <input id="domoIWeight" type="text" name="weight" placeholder="Domo Weight"/>
                <button id="DeleteButton" onClick={ (e) => Delete(e,props.name,props.id)}> Delete</button>
                <button id="ChangeButton" onClick={ (e) => Change(e,props.name,props.id)}> Change</button>
            </div>
        );
};
/*
const DomoForm = (props) => {
    return (
    <form id="domoForm" onSubmit={handleDomo} name="domoForm" action="/maker" method="POST" className="domoForm">
        
    <label htmlFor="name">Name: </label>
    <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
    <label htmlFor="age">Age: </label>
    <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
    <label id="weightLabel" htmlFor="weight">Weight(in lbs): </label>
    <input id="domoWeight" type="text" name="weight" placeholder="Domo Weight"/>
    <input type="hidden" name="_csrf" value={props.csrf} />
    <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
    </form>
    );
};
*/

const LeagueForm = (props) => {
  return(
  <div>
  <button id="MakeTeamButton" onClick={(e) => LeagueTeamMaker(e,props.csrf)}> Make Team</button>
  </div>
  )  
};


/*
const DomoList = function(props)    {
    if(props.domos.length === 0) {
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }
    
    const domoNodes = props.domos.map(function(domo) {
       return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoWeight">Weight: {domo.weight} lbs</h3>
                <button onClick={ (e) => EditDeleteButton(e,domo.name,domo.age,domo.weight,domo._id)}>Edit or Delete</button>
           </div>
       ); 
    });
    
    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
    
}
*/

const cancel = () => {
    loadTeamsFromServer();
};

const LeagueTeamMaker = (e, csrf) => {
    
    const Maker = () => {
        return (
        <form id="leagueForm" onSubmit = {handleleagueTeam} name="leagueForm" action="/maketeam" method="POST" className="domoForm">
        <label htmlFor="name">Name of Team: </label>
        <input id="TeamName" type="text" name="name" placeholder="Team Name"/>
        <input  id="cs" type="hidden" name="_csrf" value={csrf} />
        <input type="button" id="Cancel" value="Cancel" onClick = {(e) => cancel() }/>
        <input  type="submit" value="Make Team"/>
        </form>
        );
    };
    
    ReactDOM.render(
            <Maker csrf={csrf} />, document.querySelector("#leagueTeamgroup")   
       ); 
    
    
    
}

const join = (e, teamname, csrf) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:"hide"},350);
    
    sendAjax("GET", "/getToken", null, (result) => {
        
    teamjoinedname = teamname;
    
    let data = `teamname=${teamname}&_csrf=${result.csrfToken}`;
    
     sendAjax("POST", "/jointeam", data ,() => {
     loadSpecificTeamsFromServer();
  });
    
});
  return false;   
};

const leave = (e, teamname) => {
    
  sendAjax("GET", "/getToken", null, (result) => {
      let data = `teamname=${teamname}&_csrf=${result.csrfToken}`; 
    sendAjax("POST", "/leaveTeam", data, () => {
        sendAjax("GET", "/getTeams", null, (data) => {
            ReactDOM.render(
                <LeagueList leagueteams={data.teams} />, document.querySelector("#leagueTeamgroup")  
       ); 
     }); 
   });
  });
};



const LeagueList = (props) => {
  if(props.leagueteams.length === 0) {
      return(
        <div className="leagueList">
            <h3 className="emptyDomo">No Teams yet</h3>  
        </div>
      );
  }
    
  const teamNodes = props.leagueteams.map(function(leagueteam) {
     return (
        <div>
         <h3>Name of Team: {leagueteam.name}</h3>
         <h3>Top: {leagueteam.Top}</h3>
         <h3>Jungle: {leagueteam.Jungle}</h3>
         <h3>Mid: {leagueteam.Mid}</h3>
         <h3>ADC: {leagueteam.ADC}</h3>
         <h3>Support: {leagueteam.Support}</h3>
         { leagueteam[role] == null &&
         <button id="Join" onClick={ (e) => join(e, leagueteam.name, props.csrf) }>Join</button>
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
        <div>
         <h3>Name of Team: {leagueteam.name}</h3>
         <h3>Top: {leagueteam.Top}</h3>
         <h3>Jungle: {leagueteam.Jungle}</h3>
         <h3>Mid: {leagueteam.Mid}</h3>
         <h3>ADC: {leagueteam.ADC}</h3>
         <h3>Support: {leagueteam.Support}</h3>
         <button id="leave" onClick={ (e) => leave(e,leagueteam.name) }>Leave</button>
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

/*
const loadDomosFromServer = () => {
    sendAjax("GET", "/getDomos", null, (data) => {
       ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")   
       ); 
    });
}
*/



const loadTeamsFromServer = () => {
    sendAjax("GET", "/getTeams", null, (data) => {
       ReactDOM.render(
          <LeagueList leagueteams={data.teams} />, document.querySelector("#leagueTeamgroup")  
       ); 
    });
}

const loadSpecificTeamsFromServer = () => {
    sendAjax("GET", "/getTeams", null, (data) => {
       ReactDOM.render(
          <SpecificLeagueList leagueteams={data.teams} />, document.querySelector("#leagueTeamgroup")  
       ); 
    });
}



const setup = function(csrf) {
    
    //make the form to start a team
    ReactDOM.render(
     <LeagueForm csrf={csrf} />, document.querySelector("#makeTeam")
    );
    
    //show the list
    ReactDOM.render(
        <LeagueList  leagueteams={[]} />, document.querySelector("#leagueTeamgroup")
    );
    
    //grab the list
    loadTeamsFromServer();
};

const getToken = () => {
  sendAjax("GET", "/getToken", null, (result) => {
     setup(result.csrfToken); 
  });  
};

const getRole = () => {
    sendAjax("GET", "/getRole", null, (result) => {
        role = result.role;
    });
}

$(document).ready(function() {
   getToken(); 
   getRole();
});