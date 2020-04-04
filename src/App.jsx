import React from 'react';
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from "react-router-dom";
import { ConnectedRouter } from 'connected-react-router';
import { history } from "./store/_store";
import { Helmet } from "react-helmet";

import { IntlProvider } from 'react-intl';
import { Loading } from './components';
import localeIntl from './assets/intl/data.json';
import * as func from './utils/functions';

import * as authAct from "./store/auth/_authActions";
import * as dataAct from "./store/data/_dataActions";
import * as utilsAct from "./store/utils/_utilsActions";

import NotFound from './partials/404';
import Menu from './partials/Menu';
import Footer from './partials/Footer';
import HeaderBottom from './partials/HeaderBottom';

import HomeScreen from './screens/home';

import PostList from './screens/post/post.list';
import PostDetails from './screens/post/post.details';
import PostForm from './screens/post/post.form';

import FocScreen from './screens/foc/foc.home';
import FocPhoto from './screens/foc/foc.photo';
import FocPhotoApply from './screens/foc/foc.photo.apply';
import FocPhotoProfile from './screens/foc/foc.photo.profile';
import FocPhotoProfiles from './screens/foc/foc.photo.profiles';

import BiddingScreen from './screens/bidding/bidding';

import SigninForm from './screens/auth/signin';
import SignupForm from './screens/auth/signup';
import ResetForm from './screens/auth/reset';

import UserProfile from './screens/user/profile';
import UserSettings from './screens/user/settings';

import AcademyScreen from './screens/academy/academy.home';
import AcademyIntro from './screens/academy/academy.intro';
import AcademyEnter from './screens/academy/academy.enter';
import AcademyCourses from './screens/academy/academy.courses';
import AcademyQuestions from './screens/academy/academy.questions';
import AcademyLessons from './screens/academy/academy.lessons';
import AcademyLesson from './screens/academy/academy.lesson';
import AcademyChat from './screens/academy/academy.chat';

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
    this.setState({ doingImportantStuffs: true });
    if (logg.id) {
      func.post('users', { id: logg.id, limit: 1 }).then((res) => {
        window.init();
        this.setState({ doingImportantStuffs: false });
        if (res.status === 200) {
          let usr = res.result[0];
          if (usr.status !== 2) {
            this.props.signInSuccess(token, usr);
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
    const { utils: { lang, meta }, auth: { authenticated }, history: { location: { pathname } } } = this.props;

    return (
      <React.Fragment>
        <IntlProvider locale={lang} defaultLocale={'en'} messages={localeIntl[lang]}>
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

                </header>


                <div className="content-fixed content-auth-alt">
                  <HeaderBottom {...this.props} />
                  <div className="content">
                    <div className="container ht-100p">
                      <Switch>
                        <Route exact path="/" render={(props) => <HomeScreen {...props} {...this.props} row={{}} />} />

                        {/* User unauth routes */}
                        <Route exact path="/user/signin" render={(props) => <SigninForm {...props} {...this.props} row={{}} />} />
                        <Route exact path="/user/signup" render={(props) => <SignupForm {...props} {...this.props} />} />
                        <Route exact path="/user/reset" render={(props) => <ResetForm {...props} {...this.props} />} />
                        <Route exact path="/user/reset/:token" render={(props) => <ResetForm {...props} {...this.props} />} />
                        <Route exact path="/u/:username" render={(props) => <UserProfile {...props} {...this.props} />} />

                        {/* News */}
                        <Route exact path="/news" render={(props) => <PostList {...props} {...this.props} />} />
                        <Route exact path="/news/:category" render={(props) => <PostList {...props} {...this.props} />} />
                        <Route exact path="/school/:slug/:id" render={(props) => <PostList {...props} {...this.props} />} />
                        <Route exact path="/article/:slug/:id" render={(props) => <PostDetails {...props} {...this.props} />} />

                        {/* Bidding */}
                        <Route exact path="/bidding" render={(props) => <BiddingScreen {...props} {...this.props} />} />

                        {/* Academy */}
                        <Route exact path="/academy" render={(props) => <AcademyScreen {...props} {...this.props} />} />
                        <Route exact path="/academy/intro/:school/:department/:level" render={(props) => <AcademyIntro {...props} {...this.props} />} />
                        {authenticated === true && (
                          <Route exact path="/academy/enter/:school/:department/:level" render={(props) => <AcademyEnter {...props} {...this.props} />} />
                        )}
                        {authenticated === true && (
                          <Route exact path="/academy/courses/:school/:department/:level/:year" render={(props) => <AcademyCourses {...props} {...this.props} />} />
                        )}
                        {authenticated === true && (
                          <Route exact path="/academy/questions/:school/:department/:level/:year/:course" render={(props) => <AcademyQuestions {...props} {...this.props} />} />
                        )}
                        {authenticated === true && (
                          <Route exact path="/academy/lessons/:school/:department/:level" render={(props) => <AcademyLessons {...props} {...this.props} />} />
                        )}
                        {authenticated === true && (
                          <Route exact path="/academy/chat/:school/:department/:level" render={(props) => <AcademyChat {...props} {...this.props} />} />
                        )}
                        {authenticated === true && (
                          <Route exact path="/academy/chat/:school/:department/:level/:tutor" render={(props) => <AcademyChat {...props} {...this.props} />} />
                        )}
                        {authenticated === true && (
                          <Route exact path="/academy/lesson/:school/:department/:level/:course" render={(props) => <AcademyLesson {...props} {...this.props} />} />
                        )}
                        {authenticated === true && (
                          <Route exact path="/academy/questions/:school/:department/:level/:year/:course/:lesson" render={(props) => <AcademyQuestions {...props} {...this.props} />} />
                        )}

                        {authenticated === false && (
                          <Route exact path="/academy/enter/:school/:department/:level" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                        )}
                        {authenticated === false && (
                          <Route exact path="/academy/courses/:school/:department/:level/:year" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                        )}
                        {authenticated === false && (
                          <Route exact path="/academy/questions/:school/:department/:level/:year/:course" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                        )}
                        {authenticated === false && (
                          <Route exact path="/academy/lessons/:school/:department/:level" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                        )}
                        {authenticated === false && (
                          <Route exact path="/academy/lesson/:school/:department/:level/:year/:course" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                        )}
                        {authenticated === false && (
                          <Route exact path="/academy/questions/:school/:department/:level/:year/:course/:lesson" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                        )}
                        {authenticated === false && (
                          <Route exact path="/academy/chat/:school/:department/:level" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                        )}
                        {authenticated === false && (
                          <Route exact path="/academy/chat/:school/:department/:level/:tutor" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                        )}

                        {/* FOC / Photo */}
                        <Route exact path="/face-of-campus" render={(props) => <FocScreen {...props} {...this.props} />} />
                        <Route exact path="/face-of-campus/photo/:slug/:id" render={(props) => <FocPhoto {...props} {...this.props} />} />
                        <Route exact path="/face-of-campus/photo/:slug/:id/apply" render={(props) => <FocPhotoApply {...props} {...this.props} />} />
                        <Route exact path="/face-of-campus/photo/school/:code/:school/:contest" render={(props) => <FocPhotoProfiles {...props} {...this.props} />} />
                        <Route exact path="/face-of-campus/photo/profile/:username/:id/:contest" render={(props) => <FocPhotoProfile {...props} {...this.props} />} />

                        {/* User authed routes */}
                        {authenticated === true && (
                          <Route exact path="/user" render={(props) => <UserSettings {...props} {...this.props} />} />
                        )}
                        {authenticated === true && (
                          <Route exact path="/user/academy" render={(props) => <UserSettings {...props} {...this.props} />} />
                        )}
                        {authenticated === true && (
                          <Route exact path="/post-article" render={(props) => <PostForm {...props} {...this.props} />} />
                        )}
                        {authenticated === false && (
                          <Route exact path="/post-article" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                        )}
                        {authenticated === false && (
                          <Route exact path="/user/academy" render={(props) => <UserSettings {...props} {...this.props} redirect={pathname} />} />
                        )}

                        <Route render={(props) => <NotFound {...props} {...this.props} />} />
                      </Switch>
                    </div>
                  </div>
                </div>
              </div>

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
  data: state.data,
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
  setHeaderTitle: (data) => {
    dispatch(utilsAct.setHeaderTitle(data));
  },
  setSetSettings: (key, value) => {
    dispatch(dataAct.setSetSettings(key, value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);