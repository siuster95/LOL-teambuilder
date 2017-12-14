"use strict";

var teamjoinedname = void 0;
var role = void 0;
var rank = void 0;
var intervalId = void 0;
var ChangePWlink = void 0;
var MakeTeamlink = void 0;
var Logoutlink = void 0;
var errorMessage = void 0;
var usernameP = void 0;
var teamnameP = void 0;
var roleP = void 0;
var rankP = void 0;
var csrf = void 0;
var socket = void 0;
var username = void 0;
var textinput = void 0;
var chatbox = void 0;
var optionselect = void 0;
var teamsLookingfor = void 0;
var rankedBut = void 0;
var normalBut = void 0;
var RoleorRankLink = void 0;
var MatchType = void 0;

var handlePWChange = function handlePWChange(e) {
    e.preventDefault();

    sendAjax("POST", $("#ChangePWForm").attr("action"), $("#ChangePWForm").serialize(), function (result) {

        if (intervalId == -1) {
            intervalId = setInterval(loadTeamsFromServer, 1000);
        }

        loadTeamsFromServer();

        normalBut.style.display = "inline";
        rankedBut.style.display = "inline";
    });
    return false;
};

var handleRoleorRankChange = function handleRoleorRankChange(e) {
    e.preventDefault();

    sendAjax("POST", $("#ChangeRoleorRankForm").attr("action"), $("#ChangeRoleorRankForm").serialize(), function (result) {

        if (result.Role != "NoChange") {
            role = result.Role;
            roleP.innerHTML = "Role: " + result.Role;
        }

        if (result.Rank != "NoChange") {
            rank = result.Rank;
            rankP.innerHTML = "Rank: " + result.Rank;
        }

        if (intervalId == -1) {
            intervalId = setInterval(loadTeamsFromServer, 1000);
        }

        loadTeamsFromServer();
    });

    normalBut.style.display = "inline";
    rankedBut.style.display = "inline";
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
        RoleorRankLink.style.display = "none";
        MatchType.style.display = "none";

        if (intervalId == -1) {
            intervalId = setInterval(loadSpecificTeamsFromServer, 1000);
        }

        loadSpecificTeamsFromServer();

        teamnameP.innerHTML = "Teamname: " + teamjoinedname;

        socket.emit("makeTeam", { name: username, team: teamjoinedname });
    });

    return false;
};

var cancel = function cancel() {

    normalBut.style.display = "inline";
    rankedBut.style.display = "inline";

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
            React.createElement("input", { id: "TeamMakeSubmit", className: "formButton", type: "submit", value: "Make Team" }),
            React.createElement(
                "label",
                { id: "rankLabel", htmlFor: "rank" },
                "Rank: "
            ),
            React.createElement(
                "select",
                { id: "rank", name: "rank" },
                React.createElement(
                    "option",
                    { value: "Ranked" },
                    "Ranked"
                ),
                React.createElement(
                    "option",
                    { value: "Normal" },
                    "Normal"
                )
            )
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
        RoleorRankLink.style.display = "none";
        normalBut.style.display = "none";
        rankedBut.style.display = "none";
        MatchType.style.display = "none";

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
        RoleorRankLink.style.display = "inline";
        normalBut.style.display = "inline";
        rankedBut.style.display = "inline";
        MatchType.style.display = "block";
        teamnameP.innerHTML = "Teamname:";
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
    /*
    if(props.leagueteams.length === 0) {
      return(
        <div className="leagueList">
            <h3 className="emptyDomo">No Teams yet</h3>  
        </div>
      );
    }*/

    return React.createElement(
        "div",
        { "class": "leagueList" },
        React.createElement(
            "div",
            { className: "leagueList" },
            React.createElement(
                "table",
                null,
                React.createElement(
                    "caption",
                    null,
                    "Name of Team: ",
                    props.leagueteam.name
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
                        props.leagueteam.Top
                    ),
                    React.createElement(
                        "td",
                        null,
                        props.leagueteam.TopChamp
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
                        props.leagueteam.Jungle
                    ),
                    React.createElement(
                        "td",
                        null,
                        props.leagueteam.JungleChamp
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
                        props.leagueteam.Mid
                    ),
                    React.createElement(
                        "td",
                        null,
                        props.leagueteam.MidChamp
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
                        props.leagueteam.ADC
                    ),
                    React.createElement(
                        "td",
                        null,
                        props.leagueteam.ADCChamp
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
                        props.leagueteam.Support
                    ),
                    React.createElement(
                        "td",
                        null,
                        props.leagueteam.SupportChamp
                    )
                )
            ),
            React.createElement(
                "button",
                { className: "formButton", onClick: function onClick(e) {
                        return leave(e, props.leagueteam.name);
                    } },
                "Leave"
            ),
            React.createElement(
                "div",
                null,
                React.createElement(
                    "label",
                    { id: "TextInputLabel", htmlFor: "TextInput" },
                    "Message: "
                ),
                React.createElement("input", { id: "MsgInput", type: "text", name: "TextInput", placeholder: "Message here" }),
                React.createElement(
                    "button",
                    { id: "SendButton", className: "formButton", onClick: function onClick(e) {
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
                    { id: "ChampSelectLabel", htmlFor: "ChampSelect" },
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
                        { value: "Aatrox" },
                        "Aatrox"
                    ),
                    React.createElement(
                        "option",
                        { value: "Ahri" },
                        "Ahri"
                    ),
                    React.createElement(
                        "option",
                        { value: "Amumu" },
                        "Amumu"
                    ),
                    React.createElement(
                        "option",
                        { value: "Anivia" },
                        "Anivia"
                    ),
                    React.createElement(
                        "option",
                        { value: "Ashe" },
                        "Ashe"
                    ),
                    React.createElement(
                        "option",
                        { value: "Aurelion Sol" },
                        "Aurelion Sol"
                    ),
                    React.createElement(
                        "option",
                        { value: "Azir" },
                        "Azir"
                    ),
                    React.createElement(
                        "option",
                        { value: "Bard" },
                        "Bard"
                    ),
                    React.createElement(
                        "option",
                        { value: "Blitzcrank" },
                        "Blitzcrank"
                    ),
                    React.createElement(
                        "option",
                        { value: "Brand" },
                        "Brand"
                    ),
                    React.createElement(
                        "option",
                        { value: "Braum" },
                        "Braum"
                    ),
                    React.createElement(
                        "option",
                        { value: "Caitlyn" },
                        "Caitlyn"
                    ),
                    React.createElement(
                        "option",
                        { value: "Camille" },
                        "Camille"
                    ),
                    React.createElement(
                        "option",
                        { value: "Cho'gath" },
                        "Cho'gath"
                    ),
                    React.createElement(
                        "option",
                        { value: "Corki" },
                        "Corki"
                    ),
                    React.createElement(
                        "option",
                        { value: "Darius" },
                        "Darius"
                    ),
                    React.createElement(
                        "option",
                        { value: "Diana" },
                        "Diana"
                    ),
                    React.createElement(
                        "option",
                        { value: "Dr.Mundo" },
                        "Dr.Mundo"
                    ),
                    React.createElement(
                        "option",
                        { value: "Draven" },
                        "Draven"
                    ),
                    React.createElement(
                        "option",
                        { value: "Ekko" },
                        "Ekko"
                    ),
                    React.createElement(
                        "option",
                        { value: "Elise" },
                        "Elise"
                    ),
                    React.createElement(
                        "option",
                        { value: "Evelynn" },
                        "Evelynn"
                    ),
                    React.createElement(
                        "option",
                        { value: "Ezreal" },
                        "Ezreal"
                    ),
                    React.createElement(
                        "option",
                        { value: "Fiddlesticks" },
                        "Fiddlesticks"
                    ),
                    React.createElement(
                        "option",
                        { value: "Fiora" },
                        "Fiora"
                    ),
                    React.createElement(
                        "option",
                        { value: "Fizz" },
                        "Fizz"
                    ),
                    React.createElement(
                        "option",
                        { value: "Galio" },
                        "Galio"
                    ),
                    React.createElement(
                        "option",
                        { value: "Gangplank" },
                        "Gangplank"
                    ),
                    React.createElement(
                        "option",
                        { value: "Garen" },
                        "Garen"
                    ),
                    React.createElement(
                        "option",
                        { value: "Gnar" },
                        "Gnar"
                    ),
                    React.createElement(
                        "option",
                        { value: "Gragas" },
                        "Gragas"
                    ),
                    React.createElement(
                        "option",
                        { value: "Graves" },
                        "Graves"
                    ),
                    React.createElement(
                        "option",
                        { value: "Hecarim" },
                        "Hecarim"
                    ),
                    React.createElement(
                        "option",
                        { value: "Heimerdinger" },
                        "Heimerdinger"
                    ),
                    React.createElement(
                        "option",
                        { value: "Illaoi" },
                        "Illaoi"
                    ),
                    React.createElement(
                        "option",
                        { value: "Irelia" },
                        "Irelia"
                    ),
                    React.createElement(
                        "option",
                        { value: "Ivern" },
                        "Ivern"
                    ),
                    React.createElement(
                        "option",
                        { value: "Janna" },
                        "Janna"
                    ),
                    React.createElement(
                        "option",
                        { value: "Jarven 4th" },
                        "Jarven 4th"
                    ),
                    React.createElement(
                        "option",
                        { value: "Jax" },
                        "Jax"
                    ),
                    React.createElement(
                        "option",
                        { value: "Jayce" },
                        "Jayce"
                    ),
                    React.createElement(
                        "option",
                        { value: "Jhin" },
                        "Jhin"
                    ),
                    React.createElement(
                        "option",
                        { value: "Jinx" },
                        "Jinx"
                    ),
                    React.createElement(
                        "option",
                        { value: "Kalista" },
                        "Kalista"
                    ),
                    React.createElement(
                        "option",
                        { value: "Karma" },
                        "Karma"
                    ),
                    React.createElement(
                        "option",
                        { value: "Karthus" },
                        "Karthus"
                    ),
                    React.createElement(
                        "option",
                        { value: "Kassadin" },
                        "Kassadin"
                    ),
                    React.createElement(
                        "option",
                        { value: "Katarina" },
                        "Katarina"
                    ),
                    React.createElement(
                        "option",
                        { value: "Kayle" },
                        "Kayle"
                    ),
                    React.createElement(
                        "option",
                        { value: "Kayn" },
                        "Kayn"
                    ),
                    React.createElement(
                        "option",
                        { value: "Kennen" },
                        "Kennen"
                    ),
                    React.createElement(
                        "option",
                        { value: "Kha'Zix" },
                        "Kha'Zix"
                    ),
                    React.createElement(
                        "option",
                        { value: "Kindred" },
                        "Kindred"
                    ),
                    React.createElement(
                        "option",
                        { value: "Kled" },
                        "Kled"
                    ),
                    React.createElement(
                        "option",
                        { value: "Kog'Maw" },
                        "Kog'Maw"
                    ),
                    React.createElement(
                        "option",
                        { value: "LeBlanc" },
                        "LeBlanc"
                    ),
                    React.createElement(
                        "option",
                        { value: "Lee Sin" },
                        "Lee Sin"
                    ),
                    React.createElement(
                        "option",
                        { value: "Leona" },
                        "Leona"
                    ),
                    React.createElement(
                        "option",
                        { value: "Lissandra" },
                        "Lissandra"
                    ),
                    React.createElement(
                        "option",
                        { value: "Lucian" },
                        "Lucian"
                    ),
                    React.createElement(
                        "option",
                        { value: "Lulu" },
                        "Lulu"
                    ),
                    React.createElement(
                        "option",
                        { value: "Lux" },
                        "Lux"
                    ),
                    React.createElement(
                        "option",
                        { value: "Malphite" },
                        "Malphite"
                    ),
                    React.createElement(
                        "option",
                        { value: "Malzahar" },
                        "Malzahar"
                    ),
                    React.createElement(
                        "option",
                        { value: "Maokai" },
                        "Maokai"
                    ),
                    React.createElement(
                        "option",
                        { value: "Master Yi" },
                        "Master Yi"
                    ),
                    React.createElement(
                        "option",
                        { value: "Miss Fortune" },
                        "Miss Fortune"
                    ),
                    React.createElement(
                        "option",
                        { value: "Mordekaiser" },
                        "Mordekaiser"
                    ),
                    React.createElement(
                        "option",
                        { value: "Morgana" },
                        "Morgana"
                    ),
                    React.createElement(
                        "option",
                        { value: "Nami" },
                        "Nami"
                    ),
                    React.createElement(
                        "option",
                        { value: "Nasus" },
                        "Nasus"
                    ),
                    React.createElement(
                        "option",
                        { value: "Nautilus" },
                        "Nautilus"
                    ),
                    React.createElement(
                        "option",
                        { value: "Nidalee" },
                        "Nidalee"
                    ),
                    React.createElement(
                        "option",
                        { value: "Nocturne" },
                        "Nocturne"
                    ),
                    React.createElement(
                        "option",
                        { value: "Nunu" },
                        "Nunu"
                    ),
                    React.createElement(
                        "option",
                        { value: "Olaf" },
                        "Olaf"
                    ),
                    React.createElement(
                        "option",
                        { value: "Orianna" },
                        "Orianna"
                    ),
                    React.createElement(
                        "option",
                        { value: "Ornn" },
                        "Ornn"
                    ),
                    React.createElement(
                        "option",
                        { value: "Pantheon" },
                        "Pantheon"
                    ),
                    React.createElement(
                        "option",
                        { value: "Poppy" },
                        "Poppy"
                    ),
                    React.createElement(
                        "option",
                        { value: "Quinn" },
                        "Quinn"
                    ),
                    React.createElement(
                        "option",
                        { value: "Rakan" },
                        "Rakan"
                    ),
                    React.createElement(
                        "option",
                        { value: "Rammus" },
                        "Rammus"
                    ),
                    React.createElement(
                        "option",
                        { value: "Rek'Sai" },
                        "Rek'Sai"
                    ),
                    React.createElement(
                        "option",
                        { value: "Renekton" },
                        "Renekton"
                    ),
                    React.createElement(
                        "option",
                        { value: "Rengar" },
                        "Rengar"
                    ),
                    React.createElement(
                        "option",
                        { value: "Riven" },
                        "Riven"
                    ),
                    React.createElement(
                        "option",
                        { value: "Rumble" },
                        "Rumble"
                    ),
                    React.createElement(
                        "option",
                        { value: "Ryze" },
                        "Ryze"
                    ),
                    React.createElement(
                        "option",
                        { value: "Sejuani" },
                        "Sejuani"
                    ),
                    React.createElement(
                        "option",
                        { value: "Shaco" },
                        "Shaco"
                    ),
                    React.createElement(
                        "option",
                        { value: "Shen" },
                        "Shen"
                    ),
                    React.createElement(
                        "option",
                        { value: "Shyvana" },
                        "Shyvana"
                    ),
                    React.createElement(
                        "option",
                        { value: "Singed" },
                        "Singed"
                    ),
                    React.createElement(
                        "option",
                        { value: "Sion" },
                        "Sion"
                    ),
                    React.createElement(
                        "option",
                        { value: "Sivir" },
                        "Sivir"
                    ),
                    React.createElement(
                        "option",
                        { value: "Skarner" },
                        "Skarner"
                    ),
                    React.createElement(
                        "option",
                        { value: "Sona" },
                        "Sona"
                    ),
                    React.createElement(
                        "option",
                        { value: "Swain" },
                        "Swain"
                    ),
                    React.createElement(
                        "option",
                        { value: "Syndra" },
                        "Syndra"
                    ),
                    React.createElement(
                        "option",
                        { value: "Tahm Kench" },
                        "Tahm Kench"
                    ),
                    React.createElement(
                        "option",
                        { value: "Taliyah" },
                        "Taliyah"
                    ),
                    React.createElement(
                        "option",
                        { value: "Talon" },
                        "Talon"
                    ),
                    React.createElement(
                        "option",
                        { value: "Taric" },
                        "Taric"
                    ),
                    React.createElement(
                        "option",
                        { value: "Thresh" },
                        "Thresh"
                    ),
                    React.createElement(
                        "option",
                        { value: "Tristana" },
                        "Tristana"
                    ),
                    React.createElement(
                        "option",
                        { value: "Trundle" },
                        "Trundle"
                    ),
                    React.createElement(
                        "option",
                        { value: "Tryndamere" },
                        "Tryndamere"
                    ),
                    React.createElement(
                        "option",
                        { value: "Twisted Fate" },
                        "Twisted Fate"
                    ),
                    React.createElement(
                        "option",
                        { value: "Twitch" },
                        "Twitch"
                    ),
                    React.createElement(
                        "option",
                        { value: "Udyr" },
                        "Udyr"
                    ),
                    React.createElement(
                        "option",
                        { value: "Urgot" },
                        "Urgot"
                    ),
                    React.createElement(
                        "option",
                        { value: "Varus" },
                        "Varus"
                    ),
                    React.createElement(
                        "option",
                        { value: "Vayne" },
                        "Vayne"
                    ),
                    React.createElement(
                        "option",
                        { value: "Veigar" },
                        "Veigar"
                    ),
                    React.createElement(
                        "option",
                        { value: "Vel'Koz" },
                        "Vel'Koz"
                    ),
                    React.createElement(
                        "option",
                        { value: "Vi" },
                        "Vi"
                    ),
                    React.createElement(
                        "option",
                        { value: "Viktor" },
                        "Viktor"
                    ),
                    React.createElement(
                        "option",
                        { value: "Vladimir" },
                        "Vladimir"
                    ),
                    React.createElement(
                        "option",
                        { value: "Volibear" },
                        "Volibear"
                    ),
                    React.createElement(
                        "option",
                        { value: "Warwick" },
                        "Warwick"
                    ),
                    React.createElement(
                        "option",
                        { value: "Wukong" },
                        "Wukong"
                    ),
                    React.createElement(
                        "option",
                        { value: "Xayah" },
                        "Xayah"
                    ),
                    React.createElement(
                        "option",
                        { value: "Xerath" },
                        "Xerath"
                    ),
                    React.createElement(
                        "option",
                        { value: "Xin Zhao" },
                        "Xin Zhao"
                    ),
                    React.createElement(
                        "option",
                        { value: "Yasuo" },
                        "Yasuo"
                    ),
                    React.createElement(
                        "option",
                        { value: "Yorick" },
                        "Yorick"
                    ),
                    React.createElement(
                        "option",
                        { value: "Zac" },
                        "Zac"
                    ),
                    React.createElement(
                        "option",
                        { value: "Zed" },
                        "Zed"
                    ),
                    React.createElement(
                        "option",
                        { value: "Ziggs" },
                        "Ziggs"
                    ),
                    React.createElement(
                        "option",
                        { value: "Zilean" },
                        "Zilean"
                    ),
                    React.createElement(
                        "option",
                        { value: "Zoe" },
                        "Zoe"
                    ),
                    React.createElement(
                        "option",
                        { value: "Zyra" },
                        "Zyra"
                    )
                ),
                React.createElement(
                    "button",
                    { id: "ChampSubmitButton", className: "formButton", onClick: function onClick(e) {
                            return SendChamptoServer(e);
                        } },
                    "Submit"
                ),
                React.createElement(
                    "label",
                    { id: "ChatLabel", htmlFor: "Chat" },
                    "Chat: "
                ),
                React.createElement("textarea", { rows: "4", cols: "50", id: "Chatbox", type: "text", name: "Chat" })
            )
        )
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

    var dataIn = void 0;

    if (teamsLookingfor == "Normal") {
        dataIn = "rank=Normal&_csrf=" + csrf;
    } else if (teamsLookingfor == "Ranked") {
        dataIn = "rank=Ranked&_csrf=" + csrf;
    }

    sendAjax("POST", "/getTeams", dataIn, function (data) {
        ReactDOM.render(React.createElement(LeagueList, { leagueteams: data.teams }), document.querySelector("#leagueTeamgroup"));
    });
};

var loadSpecificTeamsFromServer = function loadSpecificTeamsFromServer() {

    if (intervalId < 0) {
        return;
    }

    var dataIn = "name=" + teamjoinedname + "&_csrf=" + csrf;

    sendAjax("POST", "/oneTeam", dataIn, function (data) {
        ReactDOM.render(React.createElement(SpecificLeagueList, { leagueteam: data.teams }), document.querySelector("#leagueTeamgroup"));

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
        normalBut.style.display = "none";
        rankedBut.style.display = "none";
        onChangePWclick();
    });
    MakeTeamlink.addEventListener("click", function (e) {
        normalBut.style.display = "none";
        rankedBut.style.display = "none";
        LeagueTeamMaker(e);
    });
    normalBut.addEventListener("click", function (e) {
        teamsLookingfor = "Normal";
        MatchType.innerHTML = "Match Type: " + teamsLookingfor;
    });
    rankedBut.addEventListener("click", function (e) {
        teamsLookingfor = "Ranked";
        MatchType.innerHTML = "Match Type: " + teamsLookingfor;
    });
    RoleorRankLink.addEventListener("click", function (e) {
        normalBut.style.display = "none";
        rankedBut.style.display = "none";
        onRoleorRankclick();
    });
};

var onChangePWclick = function onChangePWclick() {

    for (var x = intervalId; x > 0; x--) {
        clearInterval(x);
    }
    intervalId = -1;

    var PWChange = function PWChange() {
        return React.createElement(
            "form",
            { id: "ChangePWForm", name: "ChangePWForm", onSubmit: handlePWChange, action: "/ChangePW", method: "POST" },
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
            React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
            React.createElement("input", { id: "ChangePWSubmit", className: "formButton", type: "submit", value: "Submit" }),
            React.createElement("input", { id: "ChangePWCancel", onClick: function onClick(e) {
                    return cancel();
                }, className: "formButton", type: "button", value: "Cancel" })
        );
    };

    ReactDOM.render(React.createElement(PWChange, null), document.querySelector("#leagueTeamgroup"));
};

var onRoleorRankclick = function onRoleorRankclick() {

    for (var x = intervalId; x > 0; x--) {
        clearInterval(x);
    }
    intervalId = -1;

    var RoleorRankChange = function RoleorRankChange() {
        return React.createElement(
            "form",
            { id: "ChangeRoleorRankForm", name: "ChangeRoleorRankForm", onSubmit: handleRoleorRankChange, action: "/ChangeRR", method: "POST" },
            React.createElement(
                "label",
                { id: "roleCLabel", name: "roleC" },
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
            React.createElement(
                "label",
                { id: "rankCLabel", htmlFor: "rankC" },
                "Rank: "
            ),
            React.createElement(
                "select",
                { id: "rankC", name: "rankC" },
                React.createElement(
                    "option",
                    { value: "NoChange" },
                    "No Change"
                ),
                React.createElement(
                    "option",
                    { value: "Bronze" },
                    "Bronze"
                ),
                React.createElement(
                    "option",
                    { value: "Silver" },
                    "Silver"
                ),
                React.createElement(
                    "option",
                    { value: "Gold" },
                    "Gold"
                ),
                React.createElement(
                    "option",
                    { value: "Platinum" },
                    "Platinum"
                ),
                React.createElement(
                    "option",
                    { value: "Diamond" },
                    "Diamond"
                ),
                React.createElement(
                    "option",
                    { value: "Master" },
                    "Master"
                ),
                React.createElement(
                    "option",
                    { value: "Challenger" },
                    "Challenger"
                )
            ),
            React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
            React.createElement("input", { id: "ChangeRRSubmit", className: "formButton", type: "submit", value: "Submit" }),
            React.createElement("input", { id: "ChangeRRCancel", onClick: function onClick(e) {
                    return cancel();
                }, className: "formButton", type: "button", value: "Cancel" })
        );
    };

    ReactDOM.render(React.createElement(RoleorRankChange, null), document.querySelector("#leagueTeamgroup"));
};

var getToken = function getToken() {
    sendAjax("GET", "/getToken", null, function (result) {
        setup(result.csrfToken);
    });
};

var getRole = function getRole() {
    sendAjax("GET", "/getRole", null, function (result) {
        role = result.role;
        usernameP.innerHTML = "Username: " + result.name;
        username = result.name;
        roleP.innerHTML = "Role: " + result.role;
        rank = result.rank;
        rankP.innerHTML = "Rank: " + result.rank;
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
