import Router from 'react-router/lib/Router'
import Route from 'react-router/lib/Route'
import IndexRoute from 'react-router/lib/IndexRoute'

import { connect } from 'react-redux'
import { Provider } from 'react-redux'
import { userVerifyToken } from '../actions'

import Splash from './splash'
import NotFound from './not-found'

import * as User from './user/index'
import * as Me from './me/index'
import * as Users from './users/index'

export default connect(null, (dispatch) => {
    return {
        change: (prevState, nextState, replace) => {
            return userVerifyToken({replace, dispatch});
        },
        enter: (nextState, replace) => {
            return userVerifyToken({replace, dispatch});
        }
    };
})((props) => {
    return (
        <Provider store={props.store}>
            <Router history={props.history}>
                <Route path="/">
                    <IndexRoute component={Splash}/>

                    <Route path="not_found/" component={NotFound}/>

                    <Route path="login/" component={User.Login}/>
                    <Route path="register/" component={User.Register}/>

                    <Route component={Me.Base} onEnter={props.enter} onChange={props.change}>
                        <Route path="logout/" component={User.Logout}/>

                        <Route path="users/">
                            <IndexRoute component={Users.List}/>

                            <Route path="new/" component={Users.Form}/>
                            <Route path="edit/:id/" component={Users.Form}/>
                            <Route path="view/:id/" component={Users.View}/>
                            <Route path="times/:user_id/" component={Me.Times.List}/>
                            <Route path="times/:user_id/new/" component={Me.Times.Form}/>
                            <Route path="times/:user_id/edit/:id/" component={Me.Times.Form}/>
                        </Route>

                        <Route path="me/">
                            <IndexRoute component={Me.Times.List}/>

                            <Route path="new/" component={Me.Times.Form}/>
                            <Route path="edit/:id/" component={Me.Times.Form}/>
                            <Route path="profile/" component={Me.Profile}/>
                        </Route>
                    </Route>
                </Route>
            </Router>
        </Provider>
    );
})