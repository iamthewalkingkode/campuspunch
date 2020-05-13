import React, { Component } from 'react';
import * as func from '../../utils/functions';

import { Loading, Advert, Comments } from '../../components';
import SideBar from '../../partials/Sidebar';
import moment from 'moment';
import { Link } from 'react-router-dom';

class PostDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            row: { user: {}, schools: [[]], category: {} },
            loading: true,
            screen: '', id: 0
        };
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'News', description: '', keywords: '' });
        const id = parseInt(this.props.match.params.article.split('.')[1]);
        this.getNews(id);
    }

    getNews(id) {
        this.setState({ loading: true });
        func.post('posts', { id, status: 1, limit: 1 }).then(res => {
            this.setState({ loading: false, id });
            if (res.status === 200) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                let row = res.result[0];
                this.props.setMetaTags({ title: row.meta_title || row.title, description: row.meta_description || row.content_small, keywords: row.meta_keywords });
                this.setState({ row });
            }
        });
    }

    render() {
        const { loading, row, id } = this.state;

        return (
            <React.Fragment>
                {loading === true && (<Loading text={`loading article...`} />)}

                {loading === false && (
                    <div className="mg-b-30">
                        <Advert position="top" />

                        <div className="row">
                            <div id="news___details" className="col-12 col-sm-9 col-lg-9">
                                {row.image && (<div className="mg-b-10 news-image" style={{ backgroundImage: `url(${row.image_link})` }}></div>)}
                                <h2>{row.title}</h2>
                                <div className="bd-t bd-b mg-t-4 mg-b-4 text-muted">
                                    <small>
                                        <span>Posted in <Link to={`news/${row.category.id}`}>{row.category.name}</Link> </span>
                                        <span>| {moment(row.crdate).format('LL')} </span>
                                        {row.schools[0].name ? <span>| {row.schools[0].name}</span> : ''}
                                        {row.anonymous === 0 && (<span> | by <Link to={`/u/${row.user.username}`}>{row.user.username}</Link> </span>)}
                                    </small>
                                </div>
                                <p className="mg-t-20" dangerouslySetInnerHTML={{ __html: row.content }}></p>
                                <div className="clearfix"></div>
                                <hr />

                                <Comments item={id} type="post" {...this.props} />
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

export default PostDetails;