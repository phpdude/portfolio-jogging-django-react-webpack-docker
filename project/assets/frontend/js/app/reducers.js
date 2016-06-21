import * as ActionTypes from './actions'
import cookies from 'browser-cookies'

const token_cookie_name = 'auth_token';

const defaultUserState = {
    state: ActionTypes.USER_STATE_NOT_LOGGED_IN,
    user: null
};

export function user(state = defaultUserState, action) {
    var extra = {};

    if (action.type == ActionTypes.USER_STATE) {
        if (action.state == ActionTypes.USER_STATE_LOGGED_IN) {
            cookies.set(token_cookie_name, action['token']);

            extra.token = action['token'];
            extra.role = action['role'];
            extra.error = null;
            extra.user = action['user'];
        } else if (action.state == ActionTypes.USER_STATE_LOGIN_ERROR) {
            cookies.erase(token_cookie_name);

            extra.user = null;
            extra.role = null;
            extra.token = null;
            extra.error = action.error || 'Please check username and password';
        } else if (action.state == ActionTypes.USER_STATE_SIGN_UP_ERROR) {
            cookies.erase(token_cookie_name);

            extra.user = null;
            extra.role = null;
            extra.token = null;
            extra.error = action.error || 'Please check username and password';
        } else if (action.state == ActionTypes.USER_STATE_LOGOUT) {
            cookies.erase(token_cookie_name);

            extra.user = null;
            extra.role = null;
            extra.token = null;
            extra.error = null;
        }

        return {...state, ...extra, state: action.state};
    }

    return state;
}

export function times(state = {}, action) {
    if (action.type == ActionTypes.TIMES) {
        state = {...state};
        state[action.user_id] = action.times;
    }

    return state;
}

export function users(state = {error: '', items: null}, action) {
    if (action.type == ActionTypes.USERS) {
        if (!action.error) {
            return {...state, items: action.users, error: ''};
        } else {
            return {...state, items: null, error: action.error};
        }
    }

    return state;
}