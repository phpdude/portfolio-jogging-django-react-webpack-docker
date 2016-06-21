import cookies from 'browser-cookies'
import { push } from 'react-router-redux'
import { store } from '../store'
import { status, statusJSON } from '../utils'

export const TIMES = 'TIMES';

export function fetchTimes(user_id) {
    return (dispatch) => {
        // handle -1 for not loaded yet user
        if (user_id < 0) {
            return;
        }

        var state = store.getState();

        fetch(`/api/times/?user=${user_id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${state.user.token}`
            }
        })
            .then(statusJSON)
            .then(json => {
                dispatch({
                    type: TIMES,
                    user_id: user_id,
                    times: json
                });
            })
    }
}

export function createTime(user_id, data, redirect) {
    return (dispatch) => {
        var state = store.getState();

        fetch(`/api/times/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${state.user.token}`
            },
            body: JSON.stringify({...data, user: user_id})
        }).then(statusJSON(201)).then(response => {
            dispatch(fetchTimes(user_id));

            if (redirect) {
                dispatch(push(redirect));
            }
        })
    }
}

export function updateTime(user_id, id, data, redirect) {
    return (dispatch) => {
        var state = store.getState();

        fetch(`/api/times/${id}/`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${state.user.token}`
            },
            body: JSON.stringify({...data})
        }).then(statusJSON).then(response => {
            dispatch(fetchTimes(user_id));

            if (redirect) {
                dispatch(push(redirect));
            }
        })
    }
}

export function removeTime(user_id, id, redirect) {
    return (dispatch) => {
        var state = store.getState();

        fetch(`/api/times/${id}/`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${state.user.token}`
            }
        }).then(status(204)).then(response => {
            dispatch(fetchTimes(user_id));

            if (redirect) {
                dispatch(push(redirect));
            }
        })
    }
}