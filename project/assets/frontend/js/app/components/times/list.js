import { connect } from 'react-redux'
import { fetchTimes } from '../../actions'
import { Link } from 'react-router'
import MaskedInput from 'react-maskedinput'

class Component extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            form: {
                date_from: '',
                date_to: ''
            }
        };
    }

    getWeekOfYear(date) {
        var target = new Date(date.valueOf()),
            dayNumber = (date.getUTCDay() + 6) % 7,
            firstThursday;

        target.setUTCDate(target.getUTCDate() - dayNumber + 3);
        firstThursday = target.valueOf();
        target.setUTCMonth(0, 1);

        if (target.getUTCDay() !== 4) {
            target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
        }

        return Math.ceil((firstThursday - target) / (7 * 24 * 3600 * 1000)) + 1;
    }

    validate(e) {
        // dirty. in real project better to use any validation plugin of course
        var target = e.target,
            form = {...this.state.form};

        if (target.name) {
            form[target.name] = "" + target.value;
        }

        var date = (d) => {
            if ((d || '').match(/^\d\d\d\d-\d\d-\d\d$/)) {
                return (d || '').match(/^\d\d\d\d-\d\d-\d\d$/)[0];
            } else {
                return null;
            }
        };

        this.setState({form: form}, () => {
            form.date_from = date(form.date_from);
            form.date_to = date(form.date_to);
        });
    }

    render() {
        let props = this.props, {times, user_id} = props;

        if (times === null && props.loggedin_id) {
            props.fetch(user_id);
        }

        var url_new = '/me/new/',
            url_edit = '/me/edit/:id/',
            url_back = '/me/';
        if (props.params.user_id) {
            url_new = `/users/times/${user_id}/new/`;
            url_back = `/users/view/${user_id}/`;
            url_edit = `/users/times/${user_id}/edit/:id/`;
        }

        let weeks_report = {};
        if (times) {
            times.forEach((v) => {
                var d = this.getWeekOfYear(new Date(v.date));
                if (!(d in weeks_report)) {
                    weeks_report[d] = {speed: 0, count: 0, distance: 0, sum_speed: 0};
                }

                weeks_report[d].count += 1;
                weeks_report[d].distance += parseFloat(v.distance);
                weeks_report[d].sum_speed += v.speed;
                weeks_report[d].speed = weeks_report[d].sum_speed / weeks_report[d].count;
            });

            if (this.state.form.date_to || this.state.form.date_from) {
                let from = this.state.form.date_from ? new Date(this.state.form.date_from) : null,
                    to = this.state.form.date_to ? new Date(this.state.form.date_to) : null;

                times = times.filter((v) => {
                    var d = new Date(v.date);

                    if (from && d < from) {
                        return false;
                    }

                    return !(to && d > to);
                });
            }
        }

        var speed = 0, count = 0, distance = 0;
        if (times && times.length) {
            var first = times[0],
                firstDate = new Date(first.date);

            times.forEach(function (v) {
                if ((firstDate - new Date(v.date)) / 1000 <= 86400 * 7) {
                    speed += v.speed;
                    distance += parseFloat(v.distance);
                    count++;
                }
            });

            speed /= count;
            speed = Math.round(speed * 100) / 100;
            distance = Math.round(distance * 100) / 100;
        }

        let dateStyles = {width: 'auto', padding: '4px', height: 'auto'};

        return (
            <div>
                <header className="bar bar-nav">
                    <Link className="icon icon-left pull-left" to={url_back}/>
                    <Link className="icon icon-compose pull-right" to={url_new}/>
                    <h1 className="title">Items</h1>
                </header>
                <div className="content">
                    {times === null ?
                        <p style={{textAlign: "center"}}>Loading your items ...</p>
                        :
                        <div>
                            { speed ?
                                <p style={{textAlign: 'center', marginTop: '15px'}}>Average distance for last 7 days
                                    is {distance} mi with average speed {speed}
                                    mi/hr (based on entries list)</p> : ''}
                            <ul className="table-view">
                                <li className="table-view-cell" key='filter'>
                                    Date from: <MaskedInput type="date" mask="1111-11-11" placeholder="yyyy-mm-dd"
                                                            onChange={this.validate.bind(this)}
                                                            name="date_from" style={dateStyles}/>
                                    &nbsp;&nbsp;
                                    to: <MaskedInput type="date" mask="1111-11-11" placeholder="yyyy-mm-dd"
                                                     onChange={this.validate.bind(this)}
                                                     name="date_to" style={dateStyles}/>

                                </li>
                                {times && times.length ?
                                    times.map((row) => {
                                        return <li className="table-view-cell" key={row.id}>
                                            <Link className="navigate-right" to={url_edit.replace(/:id/, row.id)}
                                                  data-ignore="push">
                                                <big>{row.date}</big><br/>
                                                <small>
                                                    {row.time_start} - {row.time_end} ({row.time})<br/>
                                                    <b>{row.distance} mi</b> with speed <b>{row.speed} mi/h</b>
                                                </small>
                                            </Link>
                                        </li>;
                                    })
                                    : <p style={{textAlign: 'center'}}>No items to show</p>}

                                <li className="table-view-divider">Weeks Report</li>
                                <li className="table-view-cell" key='report'>
                                    {
                                        Object.keys(weeks_report).sort().map((k) => {
                                            return <div key={k}>
                                                Week #{k} distance is
                                                <b> {Math.round(weeks_report[k].distance * 100) / 100}</b>mi with
                                                average
                                                speed <b>{Math.round(weeks_report[k].speed * 100) / 100}</b>
                                                mi/hr.
                                            </div>;
                                        })
                                    }
                                </li>
                            </ul>
                            <br/><br/>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default connect((state, props) => {
    const user_id = props.params.user_id || (state.user && state.user.user && state.user.user.id) || -1;

    return {
        user_id: user_id,
        loggedin_id: (state.user && state.user.user && state.user.user.id),
        times: user_id in state.times ? state.times[user_id] : null
    };
}, (dispatch) => {
    return {
        fetch: (user_id) => dispatch(fetchTimes(user_id))
    };
})(Component)