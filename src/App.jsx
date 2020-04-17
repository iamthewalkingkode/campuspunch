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
import * as focAct from "./store/foc/_focActions";

import NotFound from './partials/404';
import Menu from './partials/Menu';
import Footer from './partials/Footer';
import HeaderBottom from './partials/HeaderBottom';
import FooterTop from './partials/FooterTop';

import HomeScreen from './screens/home';

import PostList from './screens/post/post.list';
import PostDetails from './screens/post/post.details';
import PostForm from './screens/post/post.form';

import BiddingScreen from './screens/bidding/bidding';

import SigninForm from './screens/auth/signin';
import SignupForm from './screens/auth/signup';
import ResetForm from './screens/auth/reset';

import UserProfile from './screens/user/user.profile';
import UserSettings from './screens/user/user.settings';
import UserAcademy from './screens/user/user.academy';

import AcademyScreen from './screens/academy/academy.home';
import AcademyIntro from './screens/academy/academy.intro';
import AcademyEnter from './screens/academy/academy.enter';
import AcademyCourses from './screens/academy/academy.courses';
import AcademyQuestions from './screens/academy/academy.questions';
import AcademyLessons from './screens/academy/academy.lessons';
import AcademyLesson from './screens/academy/academy.lesson';
import AcademyChat from './screens/academy/academy.chat';

import FocScreen from './screens/foc/foc.home';
import FocPhoto from './screens/foc/foc.photo';
import FocPhotoApply from './screens/foc/foc.photo.apply';
import FocPhotoProfile from './screens/foc/foc.photo.profile';
import FocPhotoProfiles from './screens/foc/foc.photo.profiles';
import FocMusic from './screens/foc/foc.music';
import FocMusicApply from './screens/foc/foc.music.apply';
import FocMusicProfile from './screens/foc/foc.music.profile';
import FocDance from './screens/foc/foc.dance';

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
    const { _auth: { logg, token } } = this.props;
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
                  {/* <div class="navbar-right">
                    <div class="dropdown dropdown-notification">
                      <span class="dropdown-link new-indicator pointer" data-toggle="dropdown">
                        <i data-feather="bell"></i>
                        <span>2</span>
                      </span>
                      <div class="dropdown-menu dropdown-menu-right">
                        <div class="dropdown-header">Notifications</div>
                        <span class="dropdown-item">
                          <div class="media">
                            <div class="avatar avatar-sm avatar-online"><img src="../../assets/img/img6.jpg" class="rounded-circle" alt="" /></div>
                            <div class="media-body mg-l-15">
                              <p>Congratulate <strong>Socrates Itumay</strong> for work anniversaries</p>
                              <span>Mar 15 12:32pm</span>
                            </div>
                          </div>
                        </span>
                        <div class="dropdown-footer"><Link to="">View all Notifications</Link></div>
                      </div>
                    </div>
                  </div> */}
                </header>


                <div className="content-fixed content-auth-alt">
                  <HeaderBottom {...this.props} />
                  <div className="content" style={{ minHeight: 800 }}>
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
                        <Route exact path="/school/:school" render={(props) => <PostList {...props} {...this.props} />} />
                        <Route exact path="/article/:article" render={(props) => <PostDetails {...props} {...this.props} />} />

                        {/* Bidding */}
                        <Route exact path="/bidding" render={(props) => <BiddingScreen {...props} {...this.props} />} />

                        {/* Academy */}
                        <Route exact path="/academy" render={(props) => <AcademyScreen {...props} {...this.props} />} />
                        <Route exact path="/academy/intro/:school/:department/:level" render={(props) => <AcademyIntro {...props} {...this.props} />} />

                        {/* FOC / Photo */}
                        <Route exact path="/face-of-campus" render={(props) => <FocScreen {...props} {...this.props} />} />
                        <Route exact path="/face-of-campus/photo/:contest" render={(props) => <FocPhoto {...props} {...this.props} />} />
                        <Route exact path="/face-of-campus/photo/:contest/apply" render={(props) => <FocPhotoApply {...props} {...this.props} />} />
                        <Route exact path="/face-of-campus/photo/school/:contest/:school" render={(props) => <FocPhotoProfiles {...props} {...this.props} />} />
                        <Route exact path="/face-of-campus/photo/profile/:contest/:user" render={(props) => <FocPhotoProfile {...props} {...this.props} />} />
                        {/* FOC / Music */}
                        <Route exact path="/face-of-campus/music/:contest" render={(props) => <FocMusic {...props} {...this.props} />} />
                        <Route exact path="/face-of-campus/music/:contest/apply" render={(props) => <FocMusicApply {...props} {...this.props} />} />
                        <Route exact path="/face-of-campus/music/:contest/:user" render={(props) => <FocMusicProfile {...props} {...this.props} />} />
                        {/* FOC / Music */}
                        <Route exact path="/face-of-campus/dance/:contest" render={(props) => <FocDance {...props} {...this.props} />} />
                        <Route exact path="/face-of-campus/dance/:contest/apply" render={(props) => <FocMusicApply {...props} {...this.props} />} />
                        <Route exact path="/face-of-campus/dance/:contest/:user" render={(props) => <FocMusicProfile {...props} {...this.props} />} />

                        {authenticated === false && (
                          <React.Fragment>
                            <Route exact path="/academy/enter/:school/:department/:level" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                            <Route exact path="/academy/courses/:school/:department/:level/:year" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                            <Route exact path="/academy/questions/:school/:department/:level/:year/:course" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                            <Route exact path="/academy/lessons/:school/:department/:level" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                            <Route exact path="/academy/lesson/:school/:department/:level/:year/:course" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                            <Route exact path="/academy/questions/:school/:department/:level/:year/:course/:lesson" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                            <Route exact path="/academy/chat/:school/:department/:level" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                            <Route exact path="/academy/chat/:school/:department/:level/:tutor" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                            <Route exact path="/post-article" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                            <Route exact path="/user/academy" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                          </React.Fragment>
                        )}

                        {authenticated === true && (
                          <React.Fragment>
                            <Route exact path="/post-article" render={(props) => <PostForm {...props} {...this.props} />} />
                            <Route exact path="/academy/enter/:school/:department/:level" render={(props) => <AcademyEnter {...props} {...this.props} />} />
                            <Route exact path="/academy/questions/:school/:department/:level/:year/:course" render={(props) => <AcademyQuestions {...props} {...this.props} />} />
                            <Route exact path="/academy/chat/:school/:department/:level" render={(props) => <AcademyChat {...props} {...this.props} />} />
                            <Route exact path="/academy/chat/:school/:department/:level/:tutor" render={(props) => <AcademyChat {...props} {...this.props} />} />
                            <Route exact path="/academy/lesson/:school/:department/:level/:course" render={(props) => <AcademyLesson {...props} {...this.props} />} />
                            <Route exact path="/academy/questions/:school/:department/:level/:year/:course/:lesson" render={(props) => <AcademyQuestions {...props} {...this.props} />} />
                            <Route exact path="/academy/courses/:school/:department/:level/:year" render={(props) => <AcademyCourses {...props} {...this.props} />} />
                            <Route exact path="/academy/lessons/:school/:department/:level" render={(props) => <AcademyLessons {...props} {...this.props} />} />
                            <Route exact path="/user" render={(props) => <UserSettings {...props} {...this.props} />} />
                            <Route exact path="/user/academy" render={(props) => <UserAcademy {...props} {...this.props} />} />
                          </React.Fragment>
                        )}

                        <Route render={(props) => <NotFound {...props} {...this.props} />} />
                      </Switch>
                    </div>
                  </div>
                  <FooterTop {...this.props} />
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
  _auth: state._auth,
  _foc: state._foc,
  _utils: state._utils,
  data: state.data,
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