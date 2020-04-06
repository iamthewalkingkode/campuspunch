import React, { Component } from 'react';
import { Tabs } from '../../components';

import UserAcademySubs from './user.academy.subs';

class UserAcademy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            submitting: false,
            errorMessage: '', code: '',
            level: 1
        };
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'My academy', description: '', keywords: '' });
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    render() {

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12 col-lg-12">
                        <ul className="nav nav-line nav-justified" id="myTab" role="tablist">
                            <Tabs.Head id="subscriptions" title="Subscriptions" active={true} />
                        </ul>
                        <div className="tab-content bds bd-gray-300 bd-t-0 pd-t-20" id="myTabContent">
                            <Tabs.Body id="subscriptions" active={true}>
                                <UserAcademySubs {...this.props} />
                            </Tabs.Body>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}

export default UserAcademy;