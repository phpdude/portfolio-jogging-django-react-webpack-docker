import cookies from 'browser-cookies'
import { push } from 'react-router-redux'
import { store } from '../store'
import { statusJSON } from '../utils'

export const USER_STATE = 'USER_STATE';

export const USER_STATE_LOGGED_IN = 'LOGGED_IN';
export const USER_STATE_LOGGING_IN = 'LOGGING_IN';
export const USER_STATE_LOGIN_ERROR = 'LOGIN_ERROR';
export const USER_STATE_SIGNING_UP = 'SIGNING_UP';
export const USER_STATE_SIGN_UP_ERROR = 'SIGN_UP_ERROR';
export const USER_STATE_VERIFING_TOKEN = 'VERIFING_TOKEN';
export const USER_STATE_NOT_LOGGED_IN = 'NOT_LOGGED_IN';
export const USER_STATE_LOGOUT = 'LOGOUT';

const token_cookie_name = 'auth_token';


export function userState(state, extra = {}) {
    if ([
            USER_STATE_LOGGED_IN, USER_STATE_LOGGING_IN, USER_STATE_LOGIN_ERROR,
            USER_STATE_SIGNING_UP, USER_STATE_SIGN_UP_ERROR,
            USER_STATE_VERIFING_TOKEN, USER_STATE_NOT_LOGGED_IN, USER_STATE_LOGOUT
        ].indexOf(state) == -1) {
        return null;
    }

    return {
        ...extra,
        type: USER_STATE,
        state: state
    }
}

export function userVerifyToken({replace, dispatch, redirect_url}) {
    dispatch = dispatch || store.dispatch;
    replace = replace || ((url) => dispatch(push(url)));

    var login = () =>replace('/login/'),
        state = store.getState();

    if (!cookies.get(token_cookie_name)) {
        login();
    } else {
        if (!state.user || state.user.state == USER_STATE_NOT_LOGGED_IN) {
            fetch('/api/auth/verify/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({token: cookies.get(token_cookie_name)})
            }).then(statusJSON).then((json) => {
                dispatch(userState(USER_STATE_LOGGED_IN, {
                    token: json['token'],
                    user: json['user'],
                    role: json['role']
                }));

                if (redirect_url) {
                    replace(redirect_url);
                }
            }).catch((e)=> {
                login();
            });
        }
    }
}


export function userLogin(username, password) {
    return function (dispatch) {
        dispatch(userState(USER_STATE_LOGGING_IN));

        return fetch(
            '/api/auth/token/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            })
            .then(statusJSON)
            .then(json => {
                dispatch(userState(USER_STATE_LOGGED_IN, {
                    token: json['token'],
                    user: json['user'],
                    role: json['role']
                }));

                store.dispatch(push('/me/'));
            })
            .catch(err => {
                dispatch(userState(USER_STATE_LOGIN_ERROR, {
                    error: "" + err
                }));
            });
    }
}

export function userSignUp(username, password, email) {
    return function (dispatch) {
        dispatch(userState(USER_STATE_SIGNING_UP));

        let error = err => dispatch(userState(USER_STATE_SIGN_UP_ERROR, {error: err}));

        return fetch(
            '/api/users/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password, email})
            })
            .then(statusJSON(201))
            .then(json => {
                dispatch(userLogin(username, password));
            })
            .catch(err => {
                error(err + "\n\n" + err.stack);
            });
    }
}

export function userLogout() {
    return (dispatch) => {
        dispatch(userState(USER_STATE_LOGOUT));
        dispatch(push('/login/'));
    }
}
