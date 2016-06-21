import { connect } from 'react-redux'
import Link from 'react-router/lib/Link'

export default connect((state) => {
    return {
        role: state.user.role
    };
})((props) => {
    return <div>
        {props.children}

        <nav className="bar bar-tab">

            <Link className="tab-item" activeClassName="active" onlyActiveOnIndex={true} to="/me/">
                <span className="icon icon-home"></span>
                <span className="tab-label">Home</span>
            </Link>

            {
                props.role == 'admin' || props.role == 'manager' ?
                    <Link className="tab-item" activeClassName="active" to="/users/">
                        <span className="icon icon-list"></span>
                        <span className="tab-label">Users</span>
                    </Link>
                    : ''
            }

            <Link className="tab-item" activeClassName="active" onlyActiveOnIndex={true} to="/me/profile/">
                <span className="icon icon-person"></span>
                <span className="tab-label">Profile</span>
            </Link>

            <Link className="tab-item" activeClassName="active" onlyActiveOnIndex={true} to="/logout/">
                <span className="icon icon-close"></span>
                <span className="tab-label">Logout</span>
            </Link>
        </nav>
    </div>;
});