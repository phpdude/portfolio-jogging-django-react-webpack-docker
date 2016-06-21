import thunkMiddleware from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Router, Route, Link, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'

import * as reducers from './reducers'

const rootReducer = combineReducers({
    ...reducers,
    routing: routerReducer
});

export const store = createStore(
    rootReducer,
    applyMiddleware(
        routerMiddleware(browserHistory),
        thunkMiddleware
    )
);

function getText(element) {
    if (element) {
        return (element.innerText || element.textContent).replace(/\s+/, ' ').replace(/^\s*/, '').replace(/\s*$/, '');
    } else {
        return "";
    }
}

export const history = syncHistoryWithStore(browserHistory, store);

const defaultTitle = document.title;

history.listen(location => {
    //  wait for document render on load. Fast hack :)
    setTimeout(()=> {
        document.title = getText(document.querySelector('header')) || defaultTitle;
    }, 50);
});
