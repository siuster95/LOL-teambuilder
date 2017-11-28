"use strict";

var teamjoinedname = void 0;
var role = void 0;
var intervalId = void 0;
var ChangePWlink = void 0;
var MakeTeamlink = void 0;

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: "hide" }, 350);

    if ($("#domoName").val() == "" || $("#domoAge").val() == "" || $("#domoWeight").val() == "") {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax("POST", $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
    });

    return false;
};

var handlePWChange = function handlePWChange(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: "hide" }, 350);

    if ($("#passC").val() != $("#pass2C").val()) {
        console.log($("#passC").val());
        console.log($("#pass2C").val());
        handleError("RAWR! Passwords must match");
        return false;
    }
    sendAjax("POST", $("#ChangePWorRoleForm").attr("action"), $("#ChangePWorRoleForm").serialize(), function (result) {

        if (result.Role != "NoChange") {
            role = result.Role;
        }
        loadTeamsFromServer();

        if (intervalId == -1) {
            intervalId = setInterval(loadTeamsFromServer, 50);
        }
    });
    return false;
};

var handleleagueTeam = function handleleagueTeam(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: "hide" }, 350);

    var teamname = $("#TeamName").val();
    teamjoinedname = $("#TeamName").val();

    var csrf = $("#cs").val();

    if (teamname == "") {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax("POST", $("#leagueForm").attr("action"), $("#leagueForm").serialize(), function (returnvalue) {
        loadSpecificTeamsFromServer();

        if (intervalId == -1) {
            intervalId = setInterval(loadSpecificTeamsFromServer, 50);
        }
    });

    return false;
};

var Delete = function Delete(e, name, id) {
    e.preventDefault();

    var data = void 0;

    sendAjax("GET", "/getToken", null, function (result) {

        data = "name=" + name + "&id=" + id + "&_csrf=" + result.csrfToken;

        sendAjax("POST", "/delete", data, function () {
            loadDomosFromServer();
        });
    });

    return false;
};

var Change = function Change(e, Oldname, id) {
    e.preventDefault();

    sendAjax("GET", "/getToken", null, function (result) {

        var name = document.querySelector("#domoIName").value;
        var age = document.querySelector("#domoIAge").value;
        var weight = document.querySelector("#domoIWeight").value;

        var data = "oldname=" + Oldname + "&name=" + name + "&age=" + age + "&weight=" + weight + "&id=" + id + "&_csrf=" + result.csrfToken;

        sendAjax("POST", "/change", data, function () {
            loadDomosFromServer();
        });
    });
};

var EditDeleteButton = function EditDeleteButton(e, name, age, weight, id) {
    e.preventDefault();

    console.log(name);
    console.log(age);
    console.log(weight);
    console.log(id);

    ReactDOM.render(React.createElement(EditDelete, { name: name, age: age, weight: weight, id: id }), document.querySelector("#domos"));
};

var EditDelete = function EditDelete(props) {
    console.log(props.weight);
    console.log(props.name);
    console.log(props.age);
    console.log(props.id);
    return React.createElement(
        "div",
        { id: "EditDomo" },
        React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
        React.createElement(
            "h3",
            { id: "NameLabel" },
            "Name: ",
            props.name
        ),
        React.createElement(
            "h3",
            { id: "AgeLabel" },
            "Age: ",
            props.age
        ),
        React.createElement(
            "h3",
            { id: "WeightDLabel" },
            "Weight: ",
            props.weight
        ),
        React.createElement(
            "label",
            { id: "NameChangeLabel", htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "domoIName", type: "text", name: "name", placeholder: "Domo Name" }),
        React.createElement(
            "label",
            { id: "AgeChangeLabel", htmlFor: "age" },
            "Age: "
        ),
        React.createElement("input", { id: "domoIAge", type: "text", name: "age", placeholder: "Domo Age" }),
        React.createElement(
            "label",
            { id: "WeightChangeLabel", htmlFor: "weight" },
            "Weight(in lbs): "
        ),
        React.createElement("input", { id: "domoIWeight", type: "text", name: "weight", placeholder: "Domo Weight" }),
        React.createElement(
            "button",
            { id: "DeleteButton", onClick: function onClick(e) {
                    return Delete(e, props.name, props.id);
                } },
            " Delete"
        ),
        React.createElement(
            "button",
            { id: "ChangeButton", onClick: function onClick(e) {
                    return Change(e, props.name, props.id);
                } },
            " Change"
        )
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
/*
const LeagueForm = (props) => {
    
  return(
  <div>
  <button id="MakeTeamButton" onClick={(e) => LeagueTeamMaker(e,props.csrf)}> Make Team</button>
  </div>
  )  
};

*/
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

var cancel = function cancel() {

    loadTeamsFromServer();

    if (intervalId == -1) {
        intervalId = setInterval(loadTeamsFromServer, 50);
    }
};

var LeagueTeamMaker = function LeagueTeamMaker(e, csrf) {

    clearInterval(intervalId);
    intervalId = -1;

    var Maker = function Maker() {
        return React.createElement(
            "form",
            { id: "leagueForm", onSubmit: handleleagueTeam, name: "leagueForm", action: "/maketeam", method: "POST", className: "domoForm" },
            React.createElement(
                "label",
                { htmlFor: "name" },
                "Name of Team: "
            ),
            React.createElement("input", { id: "TeamName", type: "text", name: "name", placeholder: "Team Name" }),
            React.createElement("input", { id: "cs", type: "hidden", name: "_csrf", value: csrf }),
            React.createElement("input", { type: "button", id: "Cancel", value: "Cancel", onClick: function onClick(e) {
                    return cancel();
                } }),
            React.createElement("input", { type: "submit", value: "Make Team" })
        );
    };

    ReactDOM.render(React.createElement(Maker, { csrf: csrf }), document.querySelector("#leagueTeamgroup"));
};

var join = function join(e, teamname, csrf) {
    e.preventDefault();

    clearInterval(intervalId);
    intervalId = -1;

    $("#domoMessage").animate({ width: "hide" }, 350);

    sendAjax("GET", "/getToken", null, function (result) {

        teamjoinedname = teamname;

        var data = "teamname=" + teamname + "&_csrf=" + result.csrfToken;

        sendAjax("POST", "/jointeam", data, function () {
            loadSpecificTeamsFromServer();

            if (intervalId == -1) {
                intervalId = setInterval(loadSpecificTeamsFromServer, 50);
            }
        });
    });
    return false;
};

var leave = function leave(e, teamname) {

    sendAjax("GET", "/getToken", null, function (result) {
        var data = "teamname=" + teamname + "&_csrf=" + result.csrfToken;
        sendAjax("POST", "/leaveTeam", data, function () {
            clearInterval(intervalId);
            intervalId = -1;
            sendAjax("GET", "/getTeams", null, function (data) {
                if (intervalId == -1) {
                    intervalId = setInterval(loadTeamsFromServer, 50);
                }
                ReactDOM.render(React.createElement(LeagueList, { leagueteams: data.teams }), document.querySelector("#leagueTeamgroup"));
            });
        });
    });
};

var LeagueList = function LeagueList(props) {
    if (props.leagueteams.length === 0) {
        return React.createElement(
            "div",
            { className: "leagueList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Teams yet"
            )
        );
    }

    var teamNodes = props.leagueteams.map(function (leagueteam) {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "h3",
                null,
                "Name of Team: ",
                leagueteam.name
            ),
            React.createElement(
                "h3",
                null,
                "Top: ",
                leagueteam.Top
            ),
            React.createElement(
                "h3",
                null,
                "Jungle: ",
                leagueteam.Jungle
            ),
            React.createElement(
                "h3",
                null,
                "Mid: ",
                leagueteam.Mid
            ),
            React.createElement(
                "h3",
                null,
                "ADC: ",
                leagueteam.ADC
            ),
            React.createElement(
                "h3",
                null,
                "Support: ",
                leagueteam.Support
            ),
            leagueteam[role] == null && React.createElement(
                "button",
                { id: "Join", onClick: function onClick(e) {
                        return join(e, leagueteam.name, props.csrf);
                    } },
                "Join"
            )
        );
    });

    return React.createElement(
        "div",
        { "class": "leagueList" },
        teamNodes
    );
};

var SpecificLeagueList = function SpecificLeagueList(props) {
    if (props.leagueteams.length === 0) {
        return React.createElement(
            "div",
            { className: "leagueList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Teams yet"
            )
        );
    }

    var teamNodes = props.leagueteams.map(function (leagueteam) {
        if (leagueteam.name == teamjoinedname) {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "h3",
                    null,
                    "Name of Team: ",
                    leagueteam.name
                ),
                React.createElement(
                    "h3",
                    null,
                    "Top: ",
                    leagueteam.Top
                ),
                React.createElement(
                    "h3",
                    null,
                    "Jungle: ",
                    leagueteam.Jungle
                ),
                React.createElement(
                    "h3",
                    null,
                    "Mid: ",
                    leagueteam.Mid
                ),
                React.createElement(
                    "h3",
                    null,
                    "ADC: ",
                    leagueteam.ADC
                ),
                React.createElement(
                    "h3",
                    null,
                    "Support: ",
                    leagueteam.Support
                ),
                React.createElement(
                    "button",
                    { id: "leave", onClick: function onClick(e) {
                            return leave(e, leagueteam.name);
                        } },
                    "Leave"
                )
            );
        }
    });

    return React.createElement(
        "div",
        { "class": "leagueList" },
        teamNodes
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

var loadTeamsFromServer = function loadTeamsFromServer() {

    console.log(intervalId);

    if (intervalId < 0) {
        return;
    }

    sendAjax("GET", "/getTeams", null, function (data) {
        ReactDOM.render(React.createElement(LeagueList, { leagueteams: data.teams }), document.querySelector("#leagueTeamgroup"));
    });
};

var loadSpecificTeamsFromServer = function loadSpecificTeamsFromServer() {

    if (intervalId < 0) {
        return;
    }

    sendAjax("GET", "/getTeams", null, function (data) {
        ReactDOM.render(React.createElement(SpecificLeagueList, { leagueteams: data.teams }), document.querySelector("#leagueTeamgroup"));
    });
};

var setup = function setup(csrf) {

    //show the list
    ReactDOM.render(React.createElement(LeagueList, { leagueteams: [] }), document.querySelector("#leagueTeamgroup"));

    //grab the list
    loadTeamsFromServer();

    if (intervalId == -1) {
        intervalId = setInterval(loadTeamsFromServer, 50);
    }

    ChangePWlink = document.querySelector("#ChangePW");
    ChangePWlink.addEventListener("click", function (e) {
        onChangePWclick(csrf);
    });
    MakeTeamlink = document.querySelector("#makeTeam");
    MakeTeamlink.addEventListener("click", function (e) {
        LeagueTeamMaker(e, csrf);
    });
};

var onChangePWclick = function onChangePWclick(csrf) {

    clearInterval(intervalId);
    intervalId = -1;

    var PWChange = function PWChange(props) {
        return React.createElement(
            "form",
            { id: "ChangePWorRoleForm", name: "ChangePWorRoleForm", onSubmit: handlePWChange, action: "/ChangePW", method: "POST", className: "mainForm" },
            React.createElement(
                "label",
                { htmlFor: "passC" },
                "New Password: "
            ),
            React.createElement("input", { id: "passC", type: "password", name: "passC", placeholder: "password" }),
            React.createElement(
                "label",
                { htmlFor: "pass2C" },
                "New Password again: "
            ),
            React.createElement("input", { id: "pass2C", type: "password", name: "pass2C", placeholder: "password Again" }),
            React.createElement(
                "label",
                { htmlFor: "roleC" },
                "Role: "
            ),
            React.createElement(
                "select",
                { id: "roleC", name: "roleC" },
                React.createElement(
                    "option",
                    { value: "NoChange" },
                    "No Change"
                ),
                React.createElement(
                    "option",
                    { value: "Top" },
                    "Top"
                ),
                React.createElement(
                    "option",
                    { value: "Jungle" },
                    "Jungle"
                ),
                React.createElement(
                    "option",
                    { value: "Mid" },
                    "Mid"
                ),
                React.createElement(
                    "option",
                    { value: "ADC" },
                    "ADC"
                ),
                React.createElement(
                    "option",
                    { value: "Support" },
                    "Support"
                )
            ),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "formSubmit", type: "submit", value: "Submit" })
        );
    };

    ReactDOM.render(React.createElement(PWChange, { csrf: csrf }), document.querySelector("#leagueTeamgroup"));
};

var getToken = function getToken() {
    sendAjax("GET", "/getToken", null, function (result) {
        setup(result.csrfToken);
    });
};

var getRole = function getRole() {
    sendAjax("GET", "/getRole", null, function (result) {
        role = result.role;
    });
};

$(document).ready(function () {
    intervalId = -1;
    getToken();
    getRole();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: "toggle" }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: "hide" }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
