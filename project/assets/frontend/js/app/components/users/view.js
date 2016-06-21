import { connect } from 'react-redux'
import { Link } from 'react-router'
import MaskedInput from 'react-maskedinput'
import * as actions from '../../actions'
import { push } from 'react-router-redux'

class Component extends React.Component {
    render() {
        var user = this.props.info;
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

                    <h1 className="title">User Details</h1>
                </header>
                <div className="content">{!this.props.id || this.props.error || this.props.items !== null ?
                    <div>
                        <form className="input-group">
                            <div className="input-row">
                                <label>Username</label>
                                <span>{user.username}</span>
                            </div>
                            <div className="input-row">
                                <label>Email</label>
                                <span>{user.email}</span>
                            </div>
                        </form>
                        <div className="clearfix"></div>

                        <ul className="table-view">
                            <li className="table-view-divider">User actions</li>
                            <li className="table-view-cell">
                                <Link className="navigate-right" to={`/users/edit/${user.id}/`}>
                                    <span className="icon icon-edit" style={{marginRight: 15, fontSize: '1em'}}/>
                                    Edit user details
                                </Link>
                                {this.props.role == 'admin' ?
                                    <Link className="navigate-right" to={`/users/times/${user.id}/`}>
                                        <span className="icon icon-list" style={{marginRight: 15, fontSize: '1em'}}/>
                                        Jogging entries
                                    </Link>
                                    : ''}
                            </li>
                        </ul>
                    </div>
                    :
                    <p>Loading users list ...</p>}</div>
            </div>
        );
    }
}

export default connect((state, props) => {
    var url = '/users/';

    return {
        user: state.user,
        role: (state.user && state.user.role),
        id: props.params.id,
        items: state.users.items,
        back_url: url
    };
}, (dispatch, props) => {
    return {
        fetch: () => dispatch(actions.fetchUsers())
    };
}, (stateProps, dispatchProps, ownProps)=> {
    let props = {...ownProps, ...stateProps, ...dispatchProps},
        {items, id, role} = props;

    if (props.user.user && items === null) {
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

        props.info = form;
    }

    return props;
})(Component)