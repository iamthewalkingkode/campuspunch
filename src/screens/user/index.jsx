import React from 'react';
import { Route, Switch } from 'react-router-dom';

const FocScreen = React.lazy(() => import('./foc.home'));
import SigninForm from './screens/auth/signin';
import SignupForm from './screens/auth/signup';
import ResetForm from './screens/auth/reset';

export default class User extends React.Component {

    render() {
        // const { _auth: { authenticated }, history: { location: { pathname } } } = this.props;

        return (
            <React.Fragment>
                <Switch>
                    <Route exact path="/user/signin" render={(props) => <SigninForm {...props} {...this.props} row={{}} />} />
                    <Route exact path="/user/signup" render={(props) => <SignupForm {...props} {...this.props} />} />
                    <Route exact path="/user/reset" render={(props) => <ResetForm {...props} {...this.props} />} />
                    <Route exact path="/user/reset/:token" render={(props) => <ResetForm {...props} {...this.props} />} />
                </Switch>
            </React.Fragment>
        )
    }
}