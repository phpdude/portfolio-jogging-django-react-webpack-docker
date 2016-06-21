import React from 'react'
import { render } from 'react-dom'

import { polyfill } from  'es6-promise'
import 'isomorphic-fetch'


import {store, history} from './app/store'

import App from './app/components/app'


$(() => {
    render(
        <App store={store} history={history}/>,
        document.getElementById('app')
    );
});