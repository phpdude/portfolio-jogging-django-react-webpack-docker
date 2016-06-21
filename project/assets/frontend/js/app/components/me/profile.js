import { connect } from 'react-redux'

export default connect((state) => {
    return {
        info: state.user
    };
})((props) => {
    return (
        <div>
            <header className="bar bar-nav">
                <h1 className="title">Profile</h1>
            </header>
            <div className="content">
                {props.info && props.info.user ?
                    <form className="input-group">
                        <div className="input-row">
                            <label>Username</label>
                            <span>{props.info.user.username}</span>
                        </div>
                        <div className="input-row">
                            <label>Email</label>
                            <span>{props.info.user.email}</span>
                        </div>
                        <div className="input-row">
                            <label>Role</label>
                            <span>{props.info.role}</span>
                        </div>
                    </form>
                    : <p style={{textAlign: 'center'}}>Loading your profile</p>}
            </div>
        </div>
    );
})