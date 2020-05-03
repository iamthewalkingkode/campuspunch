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
            data: [], school: '%', title: '%', params: {},
            loading: true,
            step: 0, total: 0, currentStep: 1, limit: props._utils.limit
        };
    }

    componentDidMount() {
        this.setState({ screen: '' });
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });
    }

    componentDidUpdate() {
        const { screen } = this.state;
        const pathname = window.location.pathname.split('/');
        if (screen !== pathname[1]) {
            this.setState({ screen: pathname[1] });
            const parsed = qs.parse(window.location.search);
            switch (pathname[1]) {
                default:
                    if (pathname[2]) {
                        this.props.setMetaTags({ title: 'News', description: '', keywords: '' });
                        this.setState({ params: { category: pathname[2], title: `%${parsed.query || ''}%` } }, () => {
                            this.getNews();
                        });
                    } else {
                        this.props.setMetaTags({ title: 'News', description: '', keywords: '' });
                        this.setState({ params: { title: `%${parsed.query || ''}%` } }, () => {
                            this.getNews();
                        });
                    }
                    break;
                case 'posts':
                    this.props.setMetaTags({ title: 'News', description: '', keywords: '' });
                    this.setState({ params: { title: `%${parsed.query || ''}%` } }, () => {
                        this.getNews();
                    });
                    break;
                case 'school':
                    const school = parseInt(this.props.match.params.school.split('.')[1]);
                    this.props.setMetaTags({ title: 'News', description: '', keywords: '' });
                    this.setState({ params: { school } }, () => {
                        this.getNews();
                    });
                    break;

            }
        }
    }

    getNews() {
        this.setState({ loading: true });
        const { step, limit, params } = this.state;
        params['status'] = 1;
        params['limit'] = `${step},${limit}`;
        func.post('posts', params).then(res => {
            this.setState({ loading: false });
            if (res.status === 200) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.setState({ data: res.result, total: res.count });
            }
        });
    }

    nextPrev = (e) => {
        let { limit } = this.state;
        this.setState({ currentStep: e, step: (e - 1) * limit }, () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.getNews();
        });
    }

    render() {
        const { loading, data, total, limit, currentStep } = this.state;

        return (
            <React.Fragment>
                {loading === true && data.length === 0 && (<Loading text={`loading news...`} />)}

                {(!loading || data.length > 0) && (
                    <div className="mg-b-30">
                        <Advert position="top" />

                        <div className="row">
                            {loading === true && (
                                <div className="col-12 col-sm-9 col-lg-9"><Loading size="small" text={`loading news...`} /></div>
                            )}
                            {!loading && (
                                <div className="col-12 col-sm-9 col-lg-9 mg-b-30">
                                    {data.map(row => (
                                        <NewsCard key={row.id} row={row} />
                                    ))}

                                    {total > limit && !loading && (<Pagination total={total} pageSize={limit} current={currentStep} onChange={(e) => this.nextPrev(e)} />)}
                                </div>
                            )}

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