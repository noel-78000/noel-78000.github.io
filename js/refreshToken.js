//general_api_url_root
//JWT_TOKEN_climbing
let url_refresh_token = general_api_url_root + '/refresh_token';

window.onload = startAutoReloadToken;

async function refreshToken() {
    const tokenCurrent = sessionStorage.getItem(JWT_TOKEN_climbing);
    if (tokenCurrent) {
        let response = await fetch(url_refresh_token, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + tokenCurrent,
            },
        });
        if (response && response.status === 403) {
            /*Acces to API is forbiden*/
            sessionStorage.removeItem(JWT_TOKEN_climbing);
            window.location = '/logout';
        }
        let responseObject ='';
        try {
            responseObject = await response.json();
        } catch (error) {/*do nothing*/}
        if (responseObject.token) {
            sessionStorage.setItem(JWT_TOKEN_climbing, responseObject.token);
        } else {
            clearTimeout(theTimeout);
            clearTimeout(theTimeoutForLogout);
            sessionStorage.removeItem(JWT_TOKEN_climbing);
            window.location = '/logout';
        }
    }
}

var checkTokenImmediatly = true;
function startAutoReloadToken() {
    checkToken();
    checkActivity();
}

let theTimeout = null;
function checkToken() {
    clearTimeout(theTimeout);
    const tokenCurrent = sessionStorage.getItem(JWT_TOKEN_climbing);
    if (tokenCurrent) {
        if (checkTokenImmediatly) refreshToken();
        checkTokenImmediatly = true;
        theTimeout = setTimeout(checkToken, 90000);
    }
}

document.addEventListener('keydown', checkActivity);
document.addEventListener('mousedown', checkActivity);
document.addEventListener('mousemove', checkActivity);

let theTimeoutForLogout = null;
function checkActivity() {
    clearTimeout(theTimeoutForLogout);
    theTimeoutForLogout = setTimeout(logoutForRefreshToken, 900000);
}

function logoutForRefreshToken() {
    clearTimeout(theTimeout);
    clearTimeout(theTimeoutForLogout);
    const tokenCurrent = sessionStorage.getItem(JWT_TOKEN_climbing);
    if (tokenCurrent) {
        sessionStorage.removeItem(JWT_TOKEN_climbing);
        window.location = '/logout';
    }
}