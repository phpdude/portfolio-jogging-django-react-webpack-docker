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

    static validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    validate() {
        this.state.username = (this.refs.username.value || "").trim();
        this.state.email = (this.refs.email.value || "").trim();

        this.state.passwords_not_match = this.refs.password.value && this.refs.password2.value && this.refs.password.value != this.refs.password2.value;
        this.state.bad_email = this.refs.email.value && !Component.validateEmail(this.refs.email.value);

        if (
            !this.state.passwords_not_match &&
            this.refs.password.value &&
            this.refs.password2.value &&
            this.refs.username.value.trim() &&
            Component.validateEmail(this.refs.email.value)
        ) {
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

        this.props.doSignUp(
            this.refs.username.value.trim(),
            this.refs.password.value.trim(),
            this.refs.email.value.trim()
        );

        this.disableButton();
    }

    render() {
        if (this.props.signing_up) {
            var content = <div className="logging-in">
                <p>Signing up ...</p>
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
                    Email
                    <input type="text" onChange={this.validate.bind(this)} ref="email"
                           defaultValue={this.state.email}/>
                </label>
                {
                    this.state.bad_email ? <p>Please enter correct email address</p> : ''
                }

                <label>
                    Password
                    <input type="password" onChange={this.validate.bind(this)} ref="password"/>
                </label>

                <label>
                    Retype Password
                    <input type="password" onChange={this.validate.bind(this)} ref="password2"/>
                </label>

                {
                    this.state.passwords_not_match ? <p>Password does not match</p> : ''
                }

                <button className="btn btn-positive btn-block" disabled={!this.state.canSubmit}>Register new user
                </button>
            </form>
        }

        return (
            <div className="login">
                <header className="bar bar-nav">
                    <Link to="/login/" className="btn btn-primary pull-right">
                        Login
                    </Link>
                    <h1 className="title">User registration</h1>
                </header>
                <div className="content">{content}</div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        user: state.user,
        signing_up: state.user.state == actions.USER_STATE_SIGNING_UP,
        error: state.user.state == actions.USER_STATE_SIGN_UP_ERROR && state.user.error
    };
}, (dispatch) => {
    return {
        doSignUp: (u, p, e) => dispatch(actions.userSignUp(u, p, e))
    };
})(Component)