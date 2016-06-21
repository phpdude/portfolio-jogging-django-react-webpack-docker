import { connect } from 'react-redux'
import { fetchUsers } from '../../actions'
import { Link } from 'react-router'


export default connect((state, props) => {
    let user_id = props.params.user_id || (state.user && state.user.user && state.user.user.id) || -1,
        role = (state.user && state.user.role);

    if (role && (role != 'admin' && role != 'manager')) {
        props.history.push('/not_found/');
    }

    return {
        user_id: user_id,
        loggedin_id: (state.user && state.user.user && state.user.user.id),
        role: (state.user && state.user.role),
        items: state.users.items || null
    };
}, (dispatch) => {
    return {
        fetch: () => dispatch(fetchUsers())
    };
})((props) => {
    let {items, role} = props;

    if (items === null && props.loggedin_id) {
        props.fetch();
    }

    var url_new = '/users/new/',
        url_edit = '/users/view/:id/';

    return (
        <div>
            <header className="bar bar-nav">
                <Link className="icon icon-compose pull-right" to={url_new}/>
                <h1 className="title">Users</h1>
            </header>
            <div className="content">
                {items === null ?
                    <p style={{textAlign: "center"}}>Loading users list ...</p>
                    :
                    <ul className="table-view">
                        {items.map((row) => {
                            return <li className="table-view-cell" key={row.id}>
                                <Link className="navigate-right" to={url_edit.replace(/:id/, row.id)}
                                      data-ignore="push">
                                    <big>#{row.id} {row.username}</big><br/>
                                    <small>
                                        {row.email}
                                    </small>
                                </Link>
                            </li>;
                        })}
                    </ul>

                }
            </div>
        </div>
    );
})