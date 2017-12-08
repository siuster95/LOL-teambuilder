"use strict";

var teamjoinedname = void 0;
var role = void 0;
var intervalId = void 0;
var ChangePWlink = void 0;
var MakeTeamlink = void 0;
var Logoutlink = void 0;
var errorMessage = void 0;
var usernameP = void 0;
var teamnameP = void 0;
var roleP = void 0;
var csrf = void 0;
var socket = void 0;
var username = void 0;
var textinput = void 0;
var chatbox = void 0;
var optionselect = void 0;

var handlePWChange = function handlePWChange(e) {
    e.preventDefault();

    sendAjax("POST", $("#ChangePWorRoleForm").attr("action"), $("#ChangePWorRoleForm").serialize(), function (result) {

        if (result.Role != "NoChange") {
            role = result.Role;
            roleP.innerHTML = "role: " + result.Role;
        }

        if (intervalId == -1) {
            intervalId = setInterval(loadTeamsFromServer, 1000);
        }

        loadTeamsFromServer();
    });
    return false;
};

var handleleagueTeam = function handleleagueTeam(e) {
    e.preventDefault();

    var teamname = $("#TeamName").val();
    teamjoinedname = $("#TeamName").val();

    var csrf = $("#cs").val();

    sendAjax("POST", $("#leagueForm").attr("action"), $("#leagueForm").serialize(), function (returnvalue) {

        ChangePWlink.style.display = "none";
        MakeTeamlink.style.display = "none";
        Logoutlink.style.display = "none";

        if (intervalId == -1) {
            intervalId = setInterval(loadSpecificTeamsFromServer, 1000);
        }

        loadSpecificTeamsFromServer();

        teamnameP.innerHTML = "teamname: " + teamjoinedname;

        socket.emit("makeTeam", { name: username, team: teamjoinedname });
    });

    return false;
};

var cancel = function cancel() {

    if (intervalId == -1) {
        intervalId = setInterval(loadTeamsFromServer, 1000);
    }

    loadTeamsFromServer();
};

var LeagueTeamMaker = function LeagueTeamMaker(e) {

    for (var x = intervalId; x > 0; x--) {
        clearInterval(x);
    }
    intervalId = -1;

    var Maker = function Maker() {
        return React.createElement(
            "form",
            { id: "leagueForm", onSubmit: handleleagueTeam, name: "leagueForm", action: "/maketeam", method: "POST" },
            React.createElement(
                "label",
                { htmlFor: "name" },
                "Name of Team: "
            ),
            React.createElement("input", { id: "TeamName", type: "text", name: "name", placeholder: "Team Name" }),
            React.createElement("input", { id: "cs", type: "hidden", name: "_csrf", value: csrf }),
            React.createElement("input", { className: "formButton", type: "button", id: "TeamMakeCancel", value: "Cancel", onClick: function onClick(e) {
                    return cancel();
                } }),
            React.createElement("input", { id: "TeamMakeSubmit", className: "formButton", type: "submit", value: "Make Team" })
        );
    };

    ReactDOM.render(React.createElement(Maker, null), document.querySelector("#leagueTeamgroup"));
};

var join = function join(e, teamname) {
    e.preventDefault();

    for (var x = intervalId; x > 0; x--) {
        clearInterval(x);
    }
    intervalId = -1;

    teamjoinedname = teamname;

    var data = "teamname=" + teamname + "&_csrf=" + csrf;

    sendAjax("POST", "/jointeam", data, function () {

        ChangePWlink.style.display = "none";
        MakeTeamlink.style.display = "none";
        Logoutlink.style.display = "none";

        if (intervalId == -1) {
            intervalId = setInterval(loadSpecificTeamsFromServer, 1000);
        }

        loadSpecificTeamsFromServer();

        teamnameP.innerHTML = "teamname: " + teamjoinedname;

        socket.emit("jointeam", { team: teamjoinedname, name: username });
    });

    return false;
};

var leave = function leave(e, teamname) {

    var data = "teamname=" + teamname + "&_csrf=" + csrf;
    sendAjax("POST", "/leaveTeam", data, function () {
        for (var x = intervalId; x > 0; x--) {
            clearInterval(x);
        }

        intervalId = -1;
        ChangePWlink.style.display = "inline";
        MakeTeamlink.style.display = "inline";
        Logoutlink.style.display = "inline";
        teamnameP.innerHTML = "teamname:";
        socket.emit("leaveteam", {});
        teamjoinedname = "";

        textinput = undefined;
        chatbox = undefined;

        if (intervalId == -1) {
            intervalId = setInterval(loadTeamsFromServer, 1000);
        }
        /*
        ReactDOM.render(
            <LeagueList leagueteams={data.teams} />, document.querySelector("#leagueTeamgroup")   ); */

        loadTeamsFromServer();
    });
};

var LeagueList = function LeagueList(props) {
    if (props.leagueteams.length === 0) {
        return React.createElement(
            "div",
            { className: "leagueList" },
            React.createElement(
                "h3",
                { id: "EmptyList" },
                "No Teams yet"
            )
        );
    }

    var teamNodes = props.leagueteams.map(function (leagueteam) {
        return React.createElement(
            "div",
            { className: "leagueList" },
            React.createElement(
                "table",
                null,
                React.createElement(
                    "caption",
                    null,
                    "Name of Team: ",
                    leagueteam.name
                ),
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "th",
                        null,
                        "Role"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Username"
                    )
                ),
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "td",
                        null,
                        "Top:"
                    ),
                    React.createElement(
                        "td",
                        null,
                        leagueteam.Top
                    )
                ),
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "td",
                        null,
                        "Jungle:"
                    ),
                    React.createElement(
                        "td",
                        null,
                        leagueteam.Jungle
                    )
                ),
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "td",
                        null,
                        "Mid:"
                    ),
                    React.createElement(
                        "td",
                        null,
                        leagueteam.Mid
                    )
                ),
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "td",
                        null,
                        "ADC:"
                    ),
                    React.createElement(
                        "td",
                        null,
                        leagueteam.ADC
                    )
                ),
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "td",
                        null,
                        "Support:"
                    ),
                    React.createElement(
                        "td",
                        null,
                        leagueteam.Support
                    )
                )
            ),
            leagueteam[role] == null && React.createElement(
                "button",
                { className: "formButton", onClick: function onClick(e) {
                        return join(e, leagueteam.name);
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
                { className: "leagueList" },
                React.createElement(
                    "table",
                    null,
                    React.createElement(
                        "caption",
                        null,
                        "Name of Team: ",
                        leagueteam.name
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "th",
                            null,
                            "Role"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Username"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Champs"
                        )
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            "Top:"
                        ),
                        React.createElement(
                            "td",
                            null,
                            leagueteam.Top
                        ),
                        React.createElement(
                            "td",
                            null,
                            leagueteam.TopChamp
                        )
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            "Jungle:"
                        ),
                        React.createElement(
                            "td",
                            null,
                            leagueteam.Jungle
                        ),
                        React.createElement(
                            "td",
                            null,
                            leagueteam.JungleChamp
                        )
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            "Mid:"
                        ),
                        React.createElement(
                            "td",
                            null,
                            leagueteam.Mid
                        ),
                        React.createElement(
                            "td",
                            null,
                            leagueteam.MidChamp
                        )
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            "ADC:"
                        ),
                        React.createElement(
                            "td",
                            null,
                            leagueteam.ADC
                        ),
                        React.createElement(
                            "td",
                            null,
                            leagueteam.ADCChamp
                        )
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            "Support:"
                        ),
                        React.createElement(
                            "td",
                            null,
                            leagueteam.Support
                        ),
                        React.createElement(
                            "td",
                            null,
                            leagueteam.SupportChamp
                        )
                    )
                ),
                React.createElement(
                    "button",
                    { className: "formButton", onClick: function onClick(e) {
                            return leave(e, leagueteam.name);
                        } },
                    "Leave"
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "label",
                        { htmlFor: "TextInput" },
                        "Message: "
                    ),
                    React.createElement("input", { id: "MsgInput", type: "text", name: "TextInput", placeholder: "Message here" }),
                    React.createElement(
                        "label",
                        { htmlFor: "Chat" },
                        "Chat: "
                    ),
                    React.createElement("textarea", { rows: "4", cols: "50", id: "Chatbox", type: "text", name: "Chat" }),
                    React.createElement(
                        "button",
                        { className: "formButton", onClick: function onClick(e) {
                                return SendMsgtoServer(e);
                            } },
                        "Send"
                    )
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "label",
                        { htmlFor: "ChampSelect" },
                        "Champ: "
                    ),
                    React.createElement(
                        "select",
                        { id: "ChampSelect", name: "ChampSelect" },
                        React.createElement(
                            "option",
                            { value: "No Change" },
                            "No Change"
                        ),
                        React.createElement(
                            "option",
                            { value: "Ahri" },
                            "Ahri"
                        ),
                        React.createElement(
                            "option",
                            { value: "Jarven 4" },
                            "Jarven 4"
                        ),
                        React.createElement(
                            "option",
                            { value: "Gnar" },
                            "Gnar"
                        ),
                        React.createElement(
                            "option",
                            { value: "Miss Fortune" },
                            "Miss Fortune"
                        ),
                        React.createElement(
                            "option",
                            { value: "Soraka" },
                            "Soraka"
                        )
                    ),
                    React.createElement(
                        "button",
                        { className: "formButton", onClick: function onClick(e) {
                                return SendChamptoServer(e);
                            } },
                        "Submit"
                    )
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

var SendMsgtoServer = function SendMsgtoServer(e) {
    e.preventDefault();
    //send msg and name to server
    var message = textinput.value;
    socket.emit("msgToServer", { name: username, msg: message });
    textinput.value = "";
};

var SendChamptoServer = function SendChamptoServer(e) {
    e.preventDefault();
    var Champ = optionselect.options[optionselect.selectedIndex].value;
    var data = "teamname=" + teamjoinedname + "&_csrf=" + csrf + "&Champ=" + Champ;

    sendAjax("POST", "/selectChamp", data, function () {});
};

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

        grabInTeamcomponents();
    });
};

var setup = function setup(csrfin) {

    csrf = csrfin;

    //show the list
    ReactDOM.render(React.createElement(LeagueList, { leagueteams: [] }), document.querySelector("#leagueTeamgroup"));

    //grab the list


    if (intervalId == -1) {
        intervalId = setInterval(loadTeamsFromServer, 1000);
    }

    loadTeamsFromServer();

    ChangePWlink.addEventListener("click", function (e) {
        onChangePWclick();
    });
    MakeTeamlink.addEventListener("click", function (e) {
        LeagueTeamMaker(e);
    });
};

var onChangePWclick = function onChangePWclick() {

    for (var x = intervalId; x > 0; x--) {
        clearInterval(x);
    }
    intervalId = -1;

    var PWChange = function PWChange(props) {
        return React.createElement(
            "form",
            { id: "ChangePWorRoleForm", name: "ChangePWorRoleForm", onSubmit: handlePWChange, action: "/ChangePW", method: "POST" },
            React.createElement(
                "label",
                { id: "passCLabel", htmlFor: "passC" },
                "New Password: "
            ),
            React.createElement("input", { id: "passC", type: "password", name: "passC", placeholder: "password" }),
            React.createElement(
                "label",
                { id: "pass2CLabel", htmlFor: "pass2C" },
                "New Password again: "
            ),
            React.createElement("input", { id: "pass2C", type: "password", name: "pass2C", placeholder: "password Again" }),
            React.createElement(
                "label",
                { id: "roleCLabel", htmlFor: "roleC" },
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
            React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
            React.createElement("input", { id: "ChangePWSubmit", className: "formButton", type: "submit", value: "Submit" }),
            React.createElement("input", { id: "ChangePWCancel", onClick: function onClick(e) {
                    return cancel();
                }, className: "formButton", type: "button", value: "Cancel" })
        );
    };

    ReactDOM.render(React.createElement(PWChange, null), document.querySelector("#leagueTeamgroup"));
};

var getToken = function getToken() {
    sendAjax("GET", "/getToken", null, function (result) {
        setup(result.csrfToken);
    });
};

var getRole = function getRole() {
    sendAjax("GET", "/getRole", null, function (result) {
        role = result.role;
        usernameP.innerHTML = "username: " + result.name;
        username = result.name;
        roleP.innerHTML = "role: " + result.role;
    });
};

var grabInTeamcomponents = function grabInTeamcomponents() {
    textinput = document.querySelector("#MsgInput");
    chatbox = document.querySelector("#Chatbox");
    optionselect = document.querySelector("#ChampSelect");
};

$(document).ready(function () {
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
    socket = io.connect();
    socket.on("joined", function () {
        console.log("connected on socket io");
    });

    socket.on("msg", function (data) {
        var message = data.name + " said: " + data.msg + " \n";
        chatbox.value += message;
    });
});
"use strict";

var handleError = function handleError(message) {
    errorMessage.innerHTML = message;
    setTimeout(function () {
        errorMessage.innerHTML = "";
    }, 1000);
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
