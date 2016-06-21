import { userVerifyToken } from '../actions'
import { connect } from 'react-redux'

export default connect(null, (dispatch) => {
    return {
        verify: (url) => userVerifyToken({dispatch, redirect_url: url})
    };
})(function (props) {
    setTimeout(function () {
        props.verify('/me/');
    }, 500);

    return (
        <div className="content splash">
            <h1>Jogging Tracker</h1>
            <p>Checking authorization, please wait ...</p>
        </div>
    );
});