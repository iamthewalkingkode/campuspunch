import React from 'react';
import { Route, Switch } from 'react-router-dom';

// const SigninForm = React.lazy(() => import('../auth/signup'));

const NotFound = React.lazy(() => import('../../partials/404'));
const FocScreen = React.lazy(() => import('./foc.home'));
const FocPhoto = React.lazy(() => import('./foc.photo'));
const FocPhotoApply = React.lazy(() => import('./foc.photo.apply'));
const FocPhotoProfile = React.lazy(() => import('./foc.photo.profile'));
const FocPhotoProfiles = React.lazy(() => import('./foc.photo.profiles'));
const FocMusic = React.lazy(() => import('./foc.music'));
const FocMusicApply = React.lazy(() => import('./foc.music.apply'));
const FocMusicProfile = React.lazy(() => import('./foc.music.profile'));
const FocDance = React.lazy(() => import('./foc.dance'));
const FocDanceApply = React.lazy(() => import('./foc.dance.apply'));
const FocDanceProfile = React.lazy(() => import('./foc.dance.profile'));

export default class FaceOfCampus extends React.Component {

    render() {
        // const { _auth: { authenticated }, history: { location: { pathname } } } = this.props;

        return (
            <React.Fragment>
                <Switch>
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

                    {/* FOC / Dance */}
                    <Route exact path="/face-of-campus/dance/:contest" render={(props) => <FocDance {...props} {...this.props} />} />
                    <Route exact path="/face-of-campus/dance/:contest/apply" render={(props) => <FocDanceApply {...props} {...this.props} />} />
                    <Route exact path="/face-of-campus/dance/:contest/:user" render={(props) => <FocDanceProfile {...props} {...this.props} />} />

                    <Route render={(props) => <NotFound {...props} {...this.props} />} />
                </Switch>
            </React.Fragment>
        )
    }
}