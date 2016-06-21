import { store } from '../store'
import { push } from 'react-router-redux'
import { status,statusJSON } from '../utils'

export const USERS = 'USERS';

export function fetchUsers() {
    return (dispatch) => {
        var state = store.getState();

        fetch(`/api/users/`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${state.user.token}`
            }
        }).then(statusJSON).then(json => {
            dispatch({
                type: USERS,
                users: json
            });
        })
    }
}


export function createUser(data, redirect) {
    return (dispatch) => {
        var state = store.getState();

        fetch(`/api/users/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${state.user.token}`
            },
            body: JSON.stringify({...data})
        }).then(statusJSON(201)).then(json => {
            dispatch(fetchUsers());

            if (redirect) {
                dispatch(push(redirect));
            }
        })
    }
}

export function updateUser(id, data, redirect) {
    return (dispatch) => {
        var state = store.getState();

        fetch(`/api/users/${id}/`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${state.user.token}`
            },
            body: JSON.stringify({...data})
        }).then(statusJSON).then(json => {
            dispatch(fetchUsers());

            if (redirect) {
                dispatch(push(redirect));
            }
        }).catch((err) => {
            dispatch({
                type: USERS,
                error: err
            });
        });

    }
}

export function removeUser(id, redirect) {
    return (dispatch) => {
        var state = store.getState();

        fetch(`/api/users/${id}/`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${state.user.token}`
            }
        }).then(status(204)).then(json => {
            dispatch(fetchUsers());

            if (redirect) {
                dispatch(push(redirect));
            }
        })
    }
}