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
                date: Component.getDate(),
                distance: '',
                time_start: '',
                time_end: ''
            },
            errors: {}
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

    static getDate() {
        var today = new Date(),
            dd = today.getDate(),
            mm = today.getMonth() + 1, //January is 0!
            yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        return [yyyy, mm, dd].join("-");
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

        this.setState({
            form: form
        }, function () {
            var form = this.state.form;

            if (
                form.date.match(/^\d\d\d\d-\d\d-\d\d$/) &&
                form.distance.match(/^\d+(?:\.\d+)?$/) &&
                form.time_start.match(/^\d\d:\d\d$/) &&
                form.time_end.match(/^\d\d:\d\d$/)
            ) {

                var [s1,s2] = form.time_start.split(':').map((v) => +v),
                    [e1,e2] = form.time_end.split(':').map((v) => +v);

                var errors = {};
                if (s1 >= 24 || s2 >= 60) {
                    errors.time_start = true;
                }

                if (e1 >= 24 || e2 >= 60) {
                    errors.time_end = true;
                }

                if ((s1 * 60 + s2) >= (e1 * 60 + e2)) {
                    errors.bad_date = true;
                }

                this.setState({
                    errors: errors
                });

                if (Object.keys(errors).length) {
                    this.disableButton();
                } else {
                    this.enableButton();
                }
            } else {
                this.disableButton();
            }
        });
    }

    submit(e) {
        e.preventDefault();

        if (!this.state.canSubmit) {
            return;
        }

        if (this.props.is_update) {
            this.props.update(this.props.user_id, this.props.id, this.state.form, this.props.back_url);
        } else {
            this.props.create(this.props.user_id, this.state.form, this.props.back_url);
        }

        this.disableButton();
    }

    delete() {
        if (confirm('You really want to remove this entry?')) {
            this.props.remove(this.props.user_id, this.props.id, this.props.back_url);
        }
    }

    static onKeyPressNumber(evt) {
        if (evt.which == 8) {
            return;
        } // to allow BackSpace
        if (evt.which == 44 && (evt.target.value || "").indexOf('.') == -1) {
            return;
        } // to allow ","
        if (evt.which < 48 || evt.which > 57) {
            evt.preventDefault();
        }
    }

    render() {
        let {times, user_id, id} = this.props;

        var content = <form onSubmit={this.submit.bind(this)}>
            {this.props.error ? <p className="error">Error: { this.props.error }</p> : ''}

            <label>
                Date
                <MaskedInput type="date" mask="1111-11-11" placeholder="yyyy-mm-dd"
                             onChange={this.validate.bind(this)}
                             name="date" value={this.state.form.date || Component.getDate()}/>
            </label>

            <label>
                Time Start
                <MaskedInput name="time_start" mask="11:11" placeholder="09:00"
                             onChange={this.validate.bind(this)} type="text" value={this.state.form.time_start}/>
                {this.state.errors.time_start ? <p>Please enter time in interval 00:00-23:59</p> : ''}
            </label>

            <label>
                Time End
                <MaskedInput name="time_end" mask="11:11" placeholder="10:00" onChange={this.validate.bind(this)}
                             type="text" value={this.state.form.time_end}/>

                {this.state.errors.time_end ? <p>Please enter time in interval 00:00-23:59</p> : ''}
                {this.state.errors.bad_date ? <p>Start date is bigger than end date</p> : ''}
            </label>

            <label>
                Distance, mi
                <input type="number" step="0.05" name="distance" onChange={this.validate.bind(this)}
                       min="0" onKeyPress={Component.onKeyPressNumber}
                       value={this.state.form.distance || 0.00}/>
            </label>

            <button className="btn btn-positive btn-block"
                    disabled={!this.state.canSubmit}>{this.props.is_update ? 'Update' : 'Create'}</button>
        </form>;

        return (
            <div>
                <header className="bar bar-nav">
                    {this.props.back_url ?
                        <Link to={this.props.back_url} className="icon icon-left-nav pull-left"/>
                        : ''}
                    {this.props.is_update ?
                        <button className="btn btn-link btn-nav pull-right" style={{color: 'red'}}
                                onClick={this.delete.bind(this)}>
                            <span className="icon icon-trash"></span>
                        </button>
                        : ''}

                    <h1 className="title">{this.props.is_update ? 'Edit' : 'Add New'} Time</h1>
                </header>
                <div className="content">{!this.props.id || this.props.times !== null ? content :
                    <p>Loading your times ...</p>}</div>
            </div>
        );
    }
}

export default connect((state, props) => {
    var user_id = props.params.user_id || (state.user && state.user.user && state.user.user.id) || -1,
        id = props.params.id;

    var times = null;
    if (user_id != -1) {
        times = user_id in state.times ? state.times[user_id] : null;
    }

    var url = '/me/';
    if (props.params.user_id) {
        url = `/users/times/${props.params.user_id}/`;
    }

    return {
        user: state.user,
        is_update: !!id,
        loggedin_id: (state.user && state.user.user && state.user.user.id),
        id: id,
        times: times,
        back_url: url,
        user_id: user_id
    };
}, (dispatch, props) => {
    return {
        create: (user_id, data, redirect) => dispatch(actions.createTime(user_id, data, redirect || props.back_url)),
        update: (user_id, id, data, redirect) => dispatch(actions.updateTime(user_id, id, data, redirect || props.back_url)),
        remove: (user_id, id, redirect) => dispatch(actions.removeTime(user_id, id, redirect || props.back_url)),
        fetch: (user_id) => dispatch(actions.fetchTimes(user_id)),
        redirect: (url) => dispatch(push(url))
    };
}, (stateProps, dispatchProps, ownProps)=> {
    let props = {...ownProps, ...stateProps, ...dispatchProps},
        {times, id} = props;

    if (props.loggedin_id && times === null) {
        props.fetch(props.user_id);
    }

    if (id && times) {
        var form = times.find((el) => el.id == id);

        if (!form) {
            props.redirect('/not_found/');
        }

        props.form = {
            date: form.date,
            distance: form.distance,
            time_start: form.time_start.match(/\d\d:\d\d/)[0],
            time_end: form.time_end.match(/\d\d:\d\d/)[0]
        };
    }

    return props;
})(Component)