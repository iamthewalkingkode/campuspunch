import React, { Component } from 'react';
import * as func from '../../utils/functions';

import { Loading, Advert, Comments, Share } from '../../components';
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
                this.props.setMetaTags({ title: row.meta.title || row.title, description: row.meta.description || row.content_small, keywords: row.meta.keywords });
                this.setState({ row });
            }
        });
    }

    render() {
        const { loading, row, id } = this.state;

        return (
            <React.Fragment>
                {loading === true && (<Loading text={`loading article...`} />)}

                {loading === false && row.id && (
                    <div className="mg-b-30">
                        <Advert position="top" />

                        <div className="row">
                            <div id="news___details" className="col-12 col-sm-9 col-lg-9">
                                {/* {row.image && (<div className="mg-b-10 news-image" style={{ backgroundImage: `url(${row.image_link})` }}></div>)} */}
                                {row.image && (
                                    <div className="text-center">
                                        <img className="img-fluid" src={row.image_link} alt={row.title} />
                                        <div>&nbsp;</div>
                                    </div>
                                )}
                                <h2 className="text-capitalize">{row.title.toLowerCase()}</h2>
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
                                <Share />
                                <hr />
                                <div className="pd-10 bg-gray-100">
                                    <p><b>Become a member and win amazing rewards</b></p>
                                    <p>Sign up to be a Campus Punch member and rack up points to win amazing prizes such as laptops, mobile phones, power banks, airtime credits, food items and many more.</p>

                                    <p>You accumulate points just by reading and engaging with the content on our website. <br />
                                    The more you engage, the more points you earn and the more you can win!</p>

                                    <Link to="/bidding">Register NOW!!!</Link>
                                </div>
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