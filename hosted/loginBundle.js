"use strict";

var errorMessage = void 0;

var handleLogin = function handleLogin(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: "hide" }, 350);

    console.log($("input[name=_csrf]").val());

    sendAjax('Post', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

var handleSignup = function handleSignup(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: "hide" }, 350);

    sendAjax("POST", $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

var LoginWindow = function LoginWindow(props) {
    return React.createElement(
        "form",
        { id: "loginForm", name: "loginForm", onSubmit: handleLogin, action: "/login", method: "POST", className: "mainForm" },
        React.createElement(
            "label",
            { htmlFor: "username" },
            "Username: "
        ),
        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "Password: "
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formButton", type: "submit", value: "Sign in" })
    );
};

var SignupWindow = function SignupWindow(props) {
    return React.createElement(
        "form",
        { id: "signupForm", name: "signupForm", onSubmit: handleSignup, action: "/signup", method: "POST", className: "mainForm" },
        React.createElement(
            "label",
            { htmlFor: "username" },
            "Username: "
        ),
        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "Password: "
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
        React.createElement(
            "label",
            { htmlFor: "pass2" },
            "Password: "
        ),
        React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
        React.createElement(
            "label",
            { id: "roleLoginLabel", htmlFor: "roleLogin" },
            "Role: "
        ),
        React.createElement(
            "select",
            { id: "roleLogin", name: "role" },
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
            { id: "rankLoginLabel", htmlFor: "rank" },
            "Rank: "
        ),
        React.createElement(
            "select",
            { id: "rankLogin", name: "rank" },
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
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formButton", type: "submit", value: "Sign in" })
    );
};

var createLoginWindow = function createLoginWindow(csrf) {
    ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
    ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
    var loginButton = document.querySelector("#loginButton");
    var signupButton = document.querySelector("#signupButton");
    errorMessage = document.querySelector("#errorMessage");
    signupButton.addEventListener("click", function (e) {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", function (e) {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    createLoginWindow(csrf); //default view
};

var getToken = function getToken() {
    sendAjax("GET", '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
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
