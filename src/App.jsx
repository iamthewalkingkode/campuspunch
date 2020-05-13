import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './store/_store';
import { Helmet } from 'react-helmet';

import { IntlProvider } from 'react-intl';
import { Loading } from './components';
import localeIntl from './assets/intl/data.json';
import * as func from './utils/functions';

import * as authAct from './store/auth/_authActions';
import * as dataAct from './store/data/_dataActions';
import * as utilsAct from './store/utils/_utilsActions';
import * as focAct from './store/foc/_focActions';

import PostForm from './screens/post/post.form';
const SigninForm = React.lazy(() => import('./screens/auth/signup'));

const NotFound = React.lazy(() => import('./partials/404'));
const Menu = React.lazy(() => import('./partials/Menu'));
const Footer = React.lazy(() => import('./partials/Footer'));
const HeaderBottom = React.lazy(() => import('./partials/HeaderBottom'));
const FooterTop = React.lazy(() => import('./partials/FooterTop'));
const Notifications = React.lazy(() => import('./partials/Notifications'));

const User = React.lazy(() => import('./screens/auth'));
const HomeScreen = React.lazy(() => import('./screens/home'));
const Academy = React.lazy(() => import('./screens/academy'));
const FaceOfCampus = React.lazy(() => import('./screens/foc'));

const PostList = React.lazy(() => import('./screens/post/post.list'));
const PostDetails = React.lazy(() => import('./screens/post/post.details'));

const Bidding = React.lazy(() => import('./screens/bidding'));
const UserProfile = React.lazy(() => import('./screens/user/user.profile'));

class App extends React.Component {

  state = {
    doingImportantStuffs: false
  }

  componentDidMount() {
    this.initApp();
  }

  initApp = () => {
    // ::: run some things before doingImportantStuffs the MainApp
    const { _auth: { logg } } = this.props;
    this.setState({ doingImportantStuffs: true });
    if (logg.id) {
      func.post('users', { id: logg.id, limit: 1 }).then((res) => {
        window.init();
        this.setState({ doingImportantStuffs: false });
        if (res.status === 200) {
          let usr = res.result[0];
          if (usr.status !== 2) {
            this.props.signInSuccess(usr);
            func.setStorageJson('user', usr);
          }
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
    func.post('settings/musicGenres').then((res) => {
      if (res.status === 200) {
        this.props.setSetSettings('musicGenres', res.result);
        func.setStorageJson('musicGenres', res.result);
      }
    });
    func.post('foc', { status: 1 }).then((res) => {
      window.init();
      this.setState({ doingImportantStuffs: false });
      if (res.status === 200) {
        this.props.setSetSettings('focContests', res.result);
        func.setStorageJson('focContests', res.result);
      }
    });
  }

  render() {
    const { doingImportantStuffs } = this.state;
    const { _utils: { lang, meta }, _auth: { authenticated }, history: { location: { pathname } } } = this.props;

    return (
      <React.Fragment>
        <IntlProvider locale={lang} defaultLocale="en" messages={localeIntl[lang]}>
          <Helmet>
            <title>{meta.title ? `${meta.title} :: ` : ''}CampusPunch</title>
            <meta property="og:title" content={meta.title} />
            {meta.description && (<meta name="description" content={meta.description} />)}
            {meta.description && (<meta property="og:description" content={meta.description} />)}
            {meta.keywords && (<meta name="keywords" content={meta.keywords} />)}
            <meta property="og:url" content="https://campuspunch.com" />
          </Helmet>

          <Router>
            <ConnectedRouter history={history}>
              <React.Suspense fallback={<Loading text="CampusPunch" />}>
                {doingImportantStuffs === true && (<Loading text="CampusPunch" />)}

                <div className={`${doingImportantStuffs ? 'hide' : ''}`}>
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
                    <div className="navbar-right" style={{ justifyContent: 'flex-start' }}>
                      <Notifications {...this.props} />
                    </div>
                  </header>

                  <div className="content-fixed content-auth-alt">
                    <HeaderBottom {...this.props} />
                    <div className="content" style={{ minHeight: 800 }}>
                      <div className="container ht-100p">
                        <React.Suspense fallback={<Loading text="CampusPunch" />}>
                          <Switch>
                            <Route exact path="/" render={(props) => <HomeScreen {...props} {...this.props} row={{}} />} />

                            {/* User unauth routes */}
                            <Route path="/user" render={() => <User {...this.props} />} />
                            <Route exact path="/u/:username" render={(props) => <UserProfile {...props} {...this.props} />} />
                            {authenticated === false && (
                              <Route exact path="/post-article" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                            )}
                            {authenticated === true && (
                              <Route exact path="/post-article" render={(props) => <PostForm {...props} {...this.props} redirect={pathname} />} />
                            )}

                            {/* News */}
                            <Route exact path="/news" render={(props) => <PostList {...props} {...this.props} />} />
                            <Route exact path="/news/:category" render={(props) => <PostList {...props} {...this.props} />} />
                            <Route exact path="/school/:school" render={(props) => <PostList {...props} {...this.props} />} />
                            <Route exact path="/article/:article" render={(props) => <PostDetails {...props} {...this.props} />} />
                            
                            <Route path="/bidding" render={() => <Bidding {...this.props} />} />
                            <Route path="/academy" render={() => <Academy {...this.props} />} />
                            <Route path="/face-of-campus" render={() => <FaceOfCampus {...this.props} />} />

                            <Route render={(props) => <NotFound {...props} {...this.props} />} />
                          </Switch>
                        </React.Suspense>
                      </div>
                    </div>
                    <FooterTop {...this.props} />
                  </div>
                </div>

                <Footer {...this.props} />
              </React.Suspense>
            </ConnectedRouter>
          </Router>
        </IntlProvider>
      </React.Fragment>
    );
  }

}

const mapStateToProps = (state) => ({
  _auth: state._auth,
  _foc: state._foc,
  _utils: state._utils,
  _data: state.data,
  router: state.router
});

const mapDispatchToProps = (dispatch) => ({
  signInSuccess: (data) => {
    dispatch(authAct.signInSuccess(data));
  },
  signOutSuccess: () => {
    dispatch(authAct.signOutSuccess());
  },
  setMetaTags: (data) => {
    dispatch(utilsAct.setMetaTags(data));
  },
  setHeaderBottom: (data) => {
    dispatch(utilsAct.setHeaderBottom(data));
  },
  setFooterTop: (data) => {
    dispatch(utilsAct.setFooterTop(data));
  },
  setSetSettings: (key, value) => {
    dispatch(dataAct.setSetSettings(key, value));
  },
  focVote: (key, data, onOK) => {
    dispatch(focAct.focVote(key, data, onOK));
  },
  focVoteSchool: (key, data, onOK) => {
    dispatch(focAct.focVoteSchool(key, data, onOK));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);