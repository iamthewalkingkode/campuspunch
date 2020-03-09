import React from 'react';
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from "react-router-dom";
import { ConnectedRouter } from 'connected-react-router';
import { history } from "./store/_store";
import { Helmet } from "react-helmet";

import { IntlProvider } from 'react-intl';
import localeIntl from './assets/intl/data.json';
import * as func from './utils/functions';

import * as authAct from "./store/auth/_authActions";
import * as utilsAct from "./store/utils/_utilsActions";

import NotFound from './partials/404';
import Menu from './partials/menu';
import Footer from './partials/footer';

import HomeSCreen from './screens/home';
import NewsList from './screens/news/news.list';
import NewsDetails from './screens/news/news.details';
import NewsForm from './screens/news/news.form';

import BiddingScreen from './screens/bidding/bidding';

import SigninForm from './screens/auth/signin';
import SignupForm from './screens/auth/signup';
import ResetForm from './screens/auth/reset';

import UserProfile from './screens/user/profile';
import UserSettings from './screens/user/settings';

class App extends React.Component {

  state = {
    doingImportantStuffs: false
  }

  componentDidMount() {
    this.initApp();
  }

  componentWillUpdate() {
    const loc = window.location.pathname.split('/');
    if ((loc[1] === 'user' && loc[2] === 'signout') && func.getStorage('token')) {
      this.props.signOutSuccess();
    }
  }

  initApp = () => {
    // ::: run some things before doingImportantStuffs the MainApp
    const { auth: { logg, token } } = this.props;
    if (logg.id) {
      // this.setState({ doingImportantStuffs: true });
      func.post('users', { id: logg.id, limit: 1 }).then((res) => {
        window.init();
        this.setState({ doingImportantStuffs: false });
        if (res.status === 200) {
          this.props.signInSuccess(token, res.result[0]);
          func.setStorageJson('user', res.result[0]);
        }
      });
    }
    func.post('schools', { status: 1, orderby: 'name_asc' }).then((res) => {
      if (res.status === 200) {
        this.props.setSetSettings('schools', res.result);
        func.setStorageJson('schools', res.result);
      }
    });
    func.post('settings').then((res) => {
      if (res.status === 200) {
        this.props.setSetSettings('settings', res.result);
        func.setStorageJson('settings', res.result);
      }
    });
    func.post('settings/states').then((res) => {
      if (res.status === 200) {
        this.props.setSetSettings('states', res.result);
        func.setStorageJson('states', res.result);
      }
    });
    func.post('settings/newsCategories').then((res) => {
      if (res.status === 200) {
        this.props.setSetSettings('newsCategories', res.result);
        func.setStorageJson('newsCategories', res.result);
      }
    });
  }

  render() {
    const { doingImportantStuffs } = this.state;
    const { utils: { lang, meta }, auth: { authenticated } } = this.props;

    return (
      <React.Fragment>
        <IntlProvider locale={lang} defaultLocale={'en'} messages={localeIntl[lang]}>
          <Helmet>
            <title>{meta.title} :: CampusPunch</title>
            <meta property="og:title" content={meta.title} />
            {meta.description && (<meta name="description" content={meta.description} />)}
            {meta.description && (<meta property="og:description" content={meta.description} />)}
            {meta.keywords && (<meta name="keywords" content={meta.keywords} />)}
            <meta property="og:url" content="http://campuspunch.com" />
          </Helmet>

          <Router>
            <ConnectedRouter history={history}>
              {doingImportantStuffs === true && (
                <div className="content content-fixed content-auth-alt">
                  <div className="container ht-100p tx-center text-primary">
                    <div className="spinner-grow" role="status" /> <br /> CampusPunch
                  </div>
                </div>
              )}

              {doingImportantStuffs === false && (
              <div>
                <header className="navbar navbar-header navbar-header-fixed">
                  <span id="mainMenuOpen" className="burger-menu pointer"><i data-feather="menu"></i></span>
                  <div className="navbar-brand">
                    <a href="./" className="df-logo">Campus<span>Punch</span></a>
                  </div>
                  <div id="navbarMenu" className="navbar-menu-wrapper">
                    <div className="navbar-menu-header">
                      <a href="./" className="df-logo">Campus<span>Punch</span></a>
                      <a id="mainMenuClose" href="./"><i data-feather="x"></i></a>
                    </div>
                    <Menu {...this.props} />
                  </div>
                </header>

                <div className="content content-fixed" style={{ minHeight: '100vh' }}>
                  <div className="container ht-100p">
                    <Switch>
                      <Route exact path="/" render={(props) => <HomeSCreen {...props} {...this.props} row={{}} />} />

                      {/* User unauth routes */}
                      <Route exact path="/user/signin" render={(props) => <SigninForm {...props} {...this.props} row={{}} />} />
                      <Route exact path="/user/signup" render={(props) => <SignupForm {...props} {...this.props} />} />
                      <Route exact path="/user/reset" render={(props) => <ResetForm {...props} {...this.props} />} />
                      <Route exact path="/u/:username" render={(props) => <UserProfile {...props} {...this.props} />} />

                      {/* News */}
                      <Route exact path="/news" render={(props) => <NewsList {...props} {...this.props} />} />
                      <Route exact path="/school/:slug/:id" render={(props) => <NewsList {...props} {...this.props} />} />
                      <Route exact path="/:slug/:id" render={(props) => <NewsDetails {...props} {...this.props} />} />

                      {/* Bidding */}
                      <Route exact path="/bidding" render={(props) => <BiddingScreen {...props} {...this.props} />} />

                      {/* User authed routes */}
                      {authenticated === true && (
                        <Route exact path="/user" render={(props) => <UserSettings {...props} {...this.props} />} />
                      )}
                      {authenticated === true && (
                        <Route exact path="/post-article" render={(props) => <NewsForm {...props} {...this.props} />} />
                      )}
                      {authenticated === false && (
                        <Route exact path="/post-article" render={(props) => <SigninForm {...props} {...this.props} redirect="post-article" />} />
                      )}

                      <Route render={(props) => <NotFound {...props} {...this.props} />} />
                    </Switch>
                  </div>
                </div>
              </div>
              )}

              <Footer {...this.props} />
            </ConnectedRouter>
          </Router>
        </IntlProvider>
      </React.Fragment>
    );
  }

}

const mapStateToProps = (state) => ({
  auth: state.auth,
  utils: state.utils,
  router: state.router
});

const mapDispatchToProps = (dispatch) => ({
  signInSuccess: (token, data) => {
    dispatch(authAct.signInSuccess(token, data));
  },
  signOutSuccess: () => {
    dispatch(authAct.signOutSuccess());
  },
  setMetaTags: (data) => {
    dispatch(utilsAct.setMetaTags(data));
  },
  setSetSettings: (key, value) => {
    dispatch(utilsAct.setSetSettings(key, value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);