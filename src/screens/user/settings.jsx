import React, { Component } from 'react';
// import { Form, Input, Button } from 'antd';
// import * as func from '../../utils/functions';
// import { Link } from 'react-router-dom';

import SettingsFOC from './settings.foc';
import SettingsProfile from './settings.profile';
import SettingsSocial from './settings.social';
import SettingsPassword from './settings.password';

class UserSettings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            submitting: false,
            errorMessage: '', code: '',
            level: 1
        };
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Profile settings' });
    }

    render() {
        // const { auth: { logg } } = this.props;
        // const { submitting, level, errorMessage } = this.state;

        return (
            <React.Fragment>
                <div className="row">
                    {/* <div className="col-12 col-lg-2">
                        <div class="avatar avatar-xxl">
                            <img src={logg.avatar_link} class="rounded-circle" alt={logg.fullname} />
                        </div>
                        <h5 className="mg-b-2 mg-t-10 tx-spacing--1">{logg.fullname}</h5>
                        <p className="tx-color-03 mg-b-25">@{logg.username}</p>
                        <Link to={`/u/${logg.username}`} className="btn btn-xs btn-primary flex-fill mg-l-10s">View profile</Link>
                    </div> */}
                    <div className="col-12 col-lg-12">
                        <ul class="nav nav-line nav-justified" id="myTab" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Profile Details</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="social-tab" data-toggle="tab" href="#social" role="tab" aria-controls="social" aria-selected="false">Social Channels</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="foc-tab" data-toggle="tab" href="#foc" role="tab" aria-controls="foc" aria-selected="false">FOC Details</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="password-tab" data-toggle="tab" href="#password" role="tab" aria-controls="password" aria-selected="false">Change password</a>
                            </li>
                        </ul>
                        <div class="tab-content bds bd-gray-300 bd-t-0 pd-t-20" id="myTabContent">
                            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                <SettingsProfile {...this.props} />
                            </div>
                            <div class="tab-pane fade" id="social" role="tabpanel" aria-labelledby="social-tab">
                                <SettingsSocial {...this.props} />
                            </div>
                            <div class="tab-pane fade" id="foc" role="tabpanel" aria-labelledby="foc-tab">
                                <SettingsFOC {...this.props} />
                            </div>
                            <div class="tab-pane fade" id="password" role="tabpanel" aria-labelledby="password-tab">
                                <SettingsPassword {...this.props} />
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        )
    }

}

export default UserSettings;