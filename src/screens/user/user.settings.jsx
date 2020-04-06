import React, { Component } from 'react';

import SettingsFOC from './user.settings.foc';
import SettingsProfile from './user.settings.profile';
import SettingsSocial from './user.settings.social';
import SettingsPassword from './user.settings.password';
import { Tabs } from '../../components';

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
        this.props.setMetaTags({ title: 'Profile settings', description: '', keywords: '' });
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    render() {

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12 col-lg-12">
                        <ul className="nav nav-line nav-justified" id="myTab" role="tablist">
                            <Tabs.Head id="profile" title="Profile details" active={true} />
                            <Tabs.Head id="social" title="Social channels" />
                            <Tabs.Head id="foc" title="FOC details" />
                            <Tabs.Head id="password" title="Change password" />
                        </ul>
                        <div className="tab-content bds bd-gray-300 bd-t-0 pd-t-20" id="myTabContent">
                            <Tabs.Body id="profile" active={true}>
                                <SettingsProfile {...this.props} />
                            </Tabs.Body>
                            <Tabs.Body id="social">
                                <SettingsSocial {...this.props} />
                            </Tabs.Body>
                            <Tabs.Body id="foc">
                                <SettingsFOC {...this.props} />
                            </Tabs.Body>
                            <Tabs.Body id="password">
                                <SettingsPassword {...this.props} />
                            </Tabs.Body>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}

export default UserSettings;