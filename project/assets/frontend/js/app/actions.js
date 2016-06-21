import * as Users from './actions/users'
import * as Auth from './actions/auth'
import * as Times from './actions/times'

export default {...Users, ...Auth, ...Times}