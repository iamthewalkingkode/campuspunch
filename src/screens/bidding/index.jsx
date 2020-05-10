import React from 'react';
import { Route, Switch } from 'react-router-dom';

// const SigninForm = React.lazy(() => import('../auth/signup'));
const NotFound = React.lazy(() => import('../../partials/404'));
const BiddingHome = React.lazy(() => import('./bidding.home'));

export default class Bidding extends React.Component {

    render() {
        // const { _auth: { authenticated }, history: { location: { pathname } } } = this.props;

        return (
            <React.Fragment>
                <Switch>
                    <Route exact path="/bidding" render={(props) => <BiddingHome {...props} {...this.props} />} />
                    {/* <Route exact path="/bidding/pro" render={(props) => <BiddingHome {...props} {...this.props} />} /> */}
                    <Route exact path="/bidding/pro/:user" render={(props) => <BiddingHome {...props} {...this.props} />} />

                    <Route render={(props) => <NotFound {...props} {...this.props} />} />
                </Switch>
            </React.Fragment>
        )
    }
}