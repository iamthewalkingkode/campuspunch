import React from 'react';
import { Route, Switch } from 'react-router-dom';

const SigninForm = React.lazy(() => import('./signin'));
const SignupForm = React.lazy(() => import('./signup'));
const ResetForm = React.lazy(() => import('./reset'));

const UserSettings = React.lazy(() => import('../user/user.settings'));
const UserAcademy = React.lazy(() => import('../user/user.academy'));
const UserNotifications = React.lazy(() => import('../user/user.notifications'));

export default class User extends React.Component {

    render() {
        const { _auth: { authenticated }, history: { location: { pathname } } } = this.props;

        return (
            <React.Fragment>
                {authenticated === true && (
                    <Switch>
                        <Route exact path="/user" render={(props) => <UserSettings {...props} {...this.props} />} />
                        <Route exact path="/user/academy" render={(props) => <UserAcademy {...props} {...this.props} />} />
                        <Route exact path="/user/notifications" render={(props) => <UserNotifications {...props} {...this.props} />} />

                        <Route exact path="/user/signin" render={(props) => <SigninForm {...props} {...this.props} row={{}} />} />
                        <Route exact path="/user/signup" render={(props) => <SignupForm {...props} {...this.props} />} />
                        <Route exact path="/user/reset" render={(props) => <ResetForm {...props} {...this.props} />} />
                        <Route exact path="/user/reset/:token" render={(props) => <ResetForm {...props} {...this.props} />} />
                    </Switch>
                )}

                {authenticated === false && (
                    <Switch>
                        <Route exact path="/user" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                        <Route exact path="/user/academy" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                        <Route exact path="/user/notifications" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />

                        <Route exact path="/user/signin" render={(props) => <SigninForm {...props} {...this.props} row={{}} />} />
                        <Route exact path="/user/signup" render={(props) => <SignupForm {...props} {...this.props} />} />
                        <Route exact path="/user/reset" render={(props) => <ResetForm {...props} {...this.props} />} />
                        <Route exact path="/user/reset/:token" render={(props) => <ResetForm {...props} {...this.props} />} />
                    </Switch>
                )}
            </React.Fragment>
        )
    }
}