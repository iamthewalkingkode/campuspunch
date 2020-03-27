import React, { Component } from 'react';
import { Pagination } from 'antd';
import * as qs from 'query-string';
import * as func from '../../utils/functions';

import { Loading, NewsCard, Advert } from '../../components';
import SideBar from '../../partials/Sidebar';

class PostList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            screen: '',
            data: [], school: '%', title: '%',
            loading: true,
            step: 0, total: 0, currentStep: 1, limit: props.utils.limit
        };
    }

    componentDidMount() {
        this.setState({ screen: '' });
        this.props.setHeaderTitle({ h1: '', h3: '', p: '', image: '' });
    }

    componentDidUpdate() {
        const { screen } = this.state;
        const pathname = window.location.pathname.split('/');
        if (screen !== pathname[1]) {
            this.setState({ screen: pathname[1] });
            switch (pathname[1]) {
                default:
                case 'posts':
                    this.props.setMetaTags({ title: 'News', description: '', keywords: '' });
                    const parsed = qs.parse(window.location.search);
                    this.getNews({ title: '%' + (parsed.query || '') + '%' });
                    break;
                case 'school':
                    this.props.setMetaTags({ title: 'News', description: '', keywords: '' });
                    this.getNews({ school: this.props.match.params.id });
                    break;

            }
        }
    }

    getNews(params) {
        this.setState({ loading: true });
        const { step, limit } = this.state;
        const { title, school } = params;
        this.setState({ ...params });
        func.post('posts', { status: 1, title, school, limit: `${step},${limit}` }).then(res => {
            this.setState({ loading: false });
            if (res.status === 200) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.setState({ data: res.result, total: res.count });
            }
        });
    }

    nextPrev = (e) => {
        let { limit, title, school } = this.state;
        this.setState({ currentStep: e, step: (e - 1) * limit }, () => {
            this.getNews({ title, school });
        });
    }

    render() {
        const { loading, data, total, limit, currentStep } = this.state;

        return (
            <React.Fragment>
                {loading === true && (<Loading text={`loading news...`} />)}

                {(loading === false) && (
                    <div className="mg-b-30">
                        <Advert position="top" />

                        <div className="row">
                            <div className="col-12 col-sm-9 col-lg-9">
                                {data.map(row => (
                                    <NewsCard key={row.id} row={row} />
                                ))}

                                {total > limit && loading === false && (<Pagination total={total} pageSize={limit} current={currentStep} onChange={(e) => this.nextPrev(e)} />)}
                            </div>

                            <div className="col-12 col-sm-3 col-lg-3">
                                <SideBar {...this.props} />
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        )
    }

}

export default PostList;