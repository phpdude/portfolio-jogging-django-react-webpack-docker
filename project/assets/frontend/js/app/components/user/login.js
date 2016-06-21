import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as actions from '../../actions'

class Component extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            canSubmit: false
        };
    }

    enableButton() {
        this.setState({
            canSubmit: true
        });
    }

    disableButton() {
        this.setState({
            canSubmit: false
        });
    }

    validate() {
        this.state['username'] = (this.refs.username.value || "").trim();

        if (this.refs.username.value.trim() && this.refs.password.value.trim()) {
            this.enableButton();
        } else {
            this.disableButton();
        }
    }

    submit(e) {
        e.preventDefault();

        if (!this.state.canSubmit) {
            return;
        }

        this.props.doLogin(
            this.refs.username.value.trim(),
            this.refs.password.value.trim()
        );

        this.disableButton();
    }

    render() {
        if (this.props.logging_in) {
            var content = <div className="logging-in">
                <p>Logging in ...</p>
            </div>;
        } else {
            content = <form onSubmit={this.submit.bind(this)}>
                {this.props.error ? <p className="error">Error: { this.props.error }</p> : ''}

                <label>
                    Username
                    <input type="text" onChange={this.validate.bind(this)} ref="username"
                           defaultValue={this.state.username}/>
                </label>

                <label>
                    Password
                    <input type="password" onChange={this.validate.bind(this)} ref="password"/>
                </label>

                <button className="btn btn-positive btn-block" disabled={!this.state.canSubmit}>Login</button>
            </form>
        }

        return (
            <div className="login">
                <header className="bar bar-nav">
                    <Link to="/register/" className="btn btn-primary pull-right">
                        Register
                    </Link>

                    <h1 className="title">User login</h1>
                </header>
                <div className="content">{content}</div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        user: state.user,
        logging_in: state.user.state == actions.USER_STATE_LOGGING_IN,
        error: state.user.state == actions.USER_STATE_LOGIN_ERROR && state.user.error
    };
}, (dispatch) => {
    return {
        doLogin: (u, p) => dispatch(actions.userLogin(u, p))
    };
})(Component)