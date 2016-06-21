import { connect } from 'react-redux'
import { Link } from 'react-router'
import MaskedInput from 'react-maskedinput'
import * as actions from '../../actions'
import { push } from 'react-router-redux'

class Component extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            form_initiated: false,
            canSubmit: !!props.params.id,
            form: props.form || {
                username: '',
                email: '',
                password: '',
                password2: ''
            }
        };
    }

    componentWillReceiveProps(props) {
        if (!this.state.form_initiated && props.form) {
            this.setState({
                form_initiated: true,
                form: props.form
            });
        }
    }

    enableButton() {
        this.setState({canSubmit: true});
    }

    disableButton() {
        this.setState({canSubmit: false});
    }

    validate(e) {
        // dirty. in real project better to use any validation plugin of course
        var target = e.target,
            form = {...this.state.form};

        if (target.name) {
            form[target.name] = "" + target.value;
        }

        var passwords_not_match = (form.password || form.password2) && form.password != form.password2,
            bad_email = form.email && !Component.validateEmail(form.email);

        this.setState({
            form: form,
            passwords_not_match, bad_email
        }, function () {
            var form = this.state.form;

            if (
                !bad_email && form.username.trim() &&
                ((this.props.id && (!(form.password || form.password2) || !passwords_not_match)) ||
                (!this.props.id && !passwords_not_match))
            ) {
                this.enableButton();
            } else {
                this.disableButton();
            }
        });
    }

    static validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    submit(e) {
        e.preventDefault();

        if (!this.state.canSubmit) {
            return;
        }

        let form = {...this.state.form};

        delete form.password2;
        if (!form.password) {
            delete form.password;
        }

        if (this.props.is_update) {
            this.props.update(this.props.id, form, this.props.back_url);
        } else {
            this.props.create(form, this.props.back_url);
        }

        this.disableButton();
    }

    delete() {
        if (confirm('You really want to remove this entry?')) {
            this.props.remove(this.props.id, '/users/');
        }
    }

    render() {
        var content = <form onSubmit={this.submit.bind(this)}>
            {this.props.error ? <p className="error">Error: { this.props.error }</p> : ''}

            <label>
                Username
                <input type="text" onChange={this.validate.bind(this)}
                       defaultValue={this.state.form.username} name="username"/>
            </label>

            <label>
                Email
                <input type="text" onChange={this.validate.bind(this)}
                       defaultValue={this.state.form.email} name="email"/>
            </label>
            {
                this.state.bad_email ? <p>Please enter correct email address</p> : ''
            }

            <label>
                Password
                <input type="password" onChange={this.validate.bind(this)} name="password"/>
            </label>

            <label>
                Retype Password
                <input type="password" onChange={this.validate.bind(this)} name="password2"/>
            </label>

            {
                this.state.passwords_not_match ? <p>Password does not match</p> : ''
            }

            <button className="btn btn-positive btn-block"
                    disabled={!this.state.canSubmit}>{this.props.is_update ? 'Update' : 'Create'}</button>
        </form>;

        return (
            <div>
                <header className="bar bar-nav">
                    <Link to={this.props.back_url} className="icon icon-left-nav pull-left"/>

                    {this.props.is_update ?
                        <button className="btn btn-link btn-nav pull-right" style={{color: 'red'}}
                                onClick={this.delete.bind(this)}>
                            <span className="icon icon-trash"></span>
                        </button>
                        : ''}

                    <h1 className="title">{this.props.is_update ? 'Edit' : 'Add New'} User</h1>
                </header>
                <div className="content">{!this.props.id || this.props.error || this.props.items !== null ? content :
                    <p>Loading users list ...</p>}</div>
            </div>
        );
    }
}

export default connect((state, props) => {
    var url = '/users/';
    if (!!props.params.id) {
        url = `/users/view/${props.params.id}/`;
    }

    return {
        user: state.user,
        role: (state.user && state.user.role),
        is_update: !!props.params.id,
        id: props.params.id,
        items: state.users.items,
        error: state.users.error,
        back_url: url
    };
}, (dispatch, props) => {
    return {
        create: (data, redirect) => dispatch(actions.createUser(data, redirect || props.back_url)),
        update: (id, data, redirect) => dispatch(actions.updateUser(id, data, redirect || props.back_url)),
        remove: (id, redirect) => dispatch(actions.removeUser(id, redirect || props.back_url)),
        fetch: () => dispatch(actions.fetchUsers())
    };
}, (stateProps, dispatchProps, ownProps)=> {
    let props = {...ownProps, ...stateProps, ...dispatchProps},
        {items, id, role} = props;

    if (!props.error && props.user.user && items === null) {
        props.fetch();
    }

    if (id && items !== null) {
        var form = items.find((el) => el.id == id);

        if (role && (role != 'admin' && role != 'manager')) {
            props.history.push('/not_found/');
        }

        if (!form) {
            props.history.push('/not_found/');
        }

        props['form'] = {
            username: form.username,
            email: form.email,
            password: '',
            password2: ''
        };
    }

    return props;
})(Component)