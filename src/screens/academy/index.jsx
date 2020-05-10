import React from 'react';
import { Route } from 'react-router-dom';

const SigninForm = React.lazy(() => import('../auth/signup'));
const NotFound = React.lazy(() => import('../../partials/404'));
const AcademyScreen = React.lazy(() => import('./academy.home'));
const AcademyIntro = React.lazy(() => import('./academy.intro'));
const AcademyEnter = React.lazy(() => import('./academy.enter'));
const AcademyCourses = React.lazy(() => import('./academy.courses'));
const AcademyQuestions = React.lazy(() => import('./academy.questions'));
const AcademyLessons = React.lazy(() => import('./academy.lessons'));
const AcademyLesson = React.lazy(() => import('./academy.lesson'));
const AcademyChat = React.lazy(() => import('./academy.chat'));
const AcademyBuddy = React.lazy(() => import('./academy.buddy'));

export default class Academy extends React.Component {

    render() {
        const { _auth: { authenticated }, history: { location: { pathname } } } = this.props;

        return (
            <React.Fragment>
                <Route exact path="/academy" render={(props) => <AcademyScreen {...props} {...this.props} />} />
                <Route exact path="/academy/intro/:school/:department/:level" render={(props) => <AcademyIntro {...props} {...this.props} />} />

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
                        <Route exact path="/academy/buddy/:school/:department/:level" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />
                        <Route exact path="/academy/buddy/:school/:department/:level/:buddy" render={(props) => <SigninForm {...props} {...this.props} redirect={pathname} />} />

                        <Route render={(props) => <NotFound {...props} {...this.props} />} />
                    </React.Fragment>
                )}

                {authenticated === true && (
                    <React.Fragment>
                        {/* <Route exact path="/post-article" render={(props) => <PostForm {...props} {...this.props} />} /> */}
                        <Route exact path="/academy/enter/:school/:department/:level" render={(props) => <AcademyEnter {...props} {...this.props} />} />
                        <Route exact path="/academy/questions/:school/:department/:level/:year/:course" render={(props) => <AcademyQuestions {...props} {...this.props} />} />
                        <Route exact path="/academy/chat/:school/:department/:level" render={(props) => <AcademyChat {...props} {...this.props} />} />
                        <Route exact path="/academy/chat/:school/:department/:level/:tutor" render={(props) => <AcademyChat {...props} {...this.props} />} />
                        <Route exact path="/academy/buddy/:school/:department/:level" render={(props) => <AcademyBuddy {...props} {...this.props} />} />
                        <Route exact path="/academy/buddy/:school/:department/:level/:buddy" render={(props) => <AcademyBuddy {...props} {...this.props} />} />
                        <Route exact path="/academy/lesson/:school/:department/:level/:course" render={(props) => <AcademyLesson {...props} {...this.props} />} />
                        <Route exact path="/academy/questions/:school/:department/:level/:year/:course/:lesson" render={(props) => <AcademyQuestions {...props} {...this.props} />} />
                        <Route exact path="/academy/courses/:school/:department/:level/:year" render={(props) => <AcademyCourses {...props} {...this.props} />} />
                        <Route exact path="/academy/lessons/:school/:department/:level" render={(props) => <AcademyLessons {...props} {...this.props} />} />

                        <Route render={(props) => <NotFound {...props} {...this.props} />} />
                    </React.Fragment>
                )}
            </React.Fragment>
        )
    }
}