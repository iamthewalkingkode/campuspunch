import React from 'react';
import { Route, Switch } from 'react-router-dom';

const SigninForm = React.lazy(() => import('../auth/signin'));
const SignupForm = React.lazy(() => import('../auth/signup'));
const ResetForm = React.lazy(() => import('../auth/reset'));

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