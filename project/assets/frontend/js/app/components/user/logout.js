import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as actions from '../../actions'

const Component = (props) => {
    return (
        <div className="login">
            <header className="bar bar-nav">
                <h1 className="title">User logout</h1>
            </header>
            <div className="content">
                {props.user ?
                    <div>
                        <p style={{textAlign: 'center'}}>Do you really want to logout
                            from <b>{props.user.username}</b>?</p>
                        <button className="btn btn-negative btn-block" onClick={props.doLogout}>Logout</button>
                    </div>
                    : ''}
            </div>
        </div>
    );
};

export default connect((state) => {
    return {
        user: state.user.user
    };
}, (dispatch) => {
    return {
        doLogout: () => {
            dispatch(actions.userLogout());
        }
    };
})(Component)