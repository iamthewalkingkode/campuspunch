import React, { Component } from 'react';
import * as func from '../../utils/functions';
import NotificationsCard from './components/notifications.card';
import { Pagination, Skeleton } from 'antd';

class UserNotifications extends Component {

    constructor(props) {
        super(props);
        this.state = {
            submitting: false, loading: true, data: [],
            step: 0, total: 0, currentStep: 1, limit: 25
        };
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Notifications', description: '', keywords: '' });
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        this.getNotifications();
    }

    getNotifications = () => {
        const { step, limit } = this.state;
        const { _auth: { logg } } = this.props;
        func.post('notifications', { user: logg.id, limit: `${step},${limit}` }).then(res => {
            this.setState({ loading: false });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (res.status === 200) {
                this.setState({ data: res.result, total: res.count });
            }
        });
    }

    nextPrev = (e) => {
        let { limit } = this.state;
        this.setState({ currentStep: e, step: (e - 1) * limit }, () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.getNotifications();
        });
    }

    render() {
        const { total, limit, loading, currentStep, data } = this.state;

        return (
            <React.Fragment>
                <div className="row">
                    {/* <div className="col-12 col-lg-4 mg-b-25">
                        <div className="bg-gray-100 pd-10">

                        </div>
                    </div> */}
                    <div className="col-12 col-lg-8s mg-b-25">
                        {loading && (
                            <Skeleton avatar active paragraph={{ rows: 1, style: { margin: 0 } }} />
                        )}
                        {!loading && (
                            <div class="mg-b-20 dropdown-notification">
                                {data.map(row => (
                                    <NotificationsCard {...this.props} key={row.key} row={row} />
                                ))}
                            </div>
                        )}
                        {total > limit && !loading && (<Pagination total={total} pageSize={limit} current={currentStep} onChange={(e) => this.nextPrev(e)} />)}
                    </div>
                </div>
            </React.Fragment>
        )
    }

}

export default UserNotifications;