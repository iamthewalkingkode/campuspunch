import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import * as func from '../../utils/functions';
import { Link } from 'react-router-dom';

import { Loading, NewsCard } from '../../components';
import NotFound from '../../partials/404';
import moment from 'moment';
import { Pagination, Spin } from 'antd';

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usr: {}, posts: [],
            loading: true, loadingPosts: false,
            username: '', lightImages: [], lightIndex: 0, lightOpen: false,
            step: 0, total: 0, currentStep: 1, limit: props._utils.limit,
        };
    }

    componentDidMount() {
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });
        var uri = this.props.location.pathname.split('/');
        var username = uri[2];
        if (username) {
            this.setState({ username }, () => {
                this.props.setMetaTags({ title: username, description: '', keywords: '' });
                this.setState({ loading: true });
                func.post('users', { username, limit: 1 }).then(res => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.setState({ loading: false });
                    if (res.status === 200) {
                        var usr = res.result[0];
                        setTimeout(() => {
                            window.init();
                        }, 200);
                        this.props.setMetaTags({ title: usr.username, description: usr.about, keywords: '' });
                        this.setState({ usr, lightImages: [usr.avatar_link] }, () => {
                            this.getPosts();
                        });
                    }
                });
            });
        }
    }

    nextPrev = (e) => {
        let { limit } = this.state;
        this.setState({ currentStep: e, step: (e - 1) * limit }, () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.getPosts();
        });
    }
    getPosts() {
        const { usr, step, limit } = this.state;
        this.setState({ loadingPosts: true });
        func.post('posts', { user: usr.id, limit: `${step},${limit}`, status: 1 }).then(res => {
            this.setState({ loadingPosts: false });
            if (res.status === 200) {
                this.setState({ posts: res.result, total: res.count });
            }
        });
    }

    render() {
        const { _auth: { logg } } = this.props;
        const { loading, usr, username, loadingPosts, posts, lightImages, lightIndex, lightOpen, total, limit, currentStep } = this.state;

        return (
            <React.Fragment>
                {loading === true && (<Loading text={`loading ${username}'s profile...`} />)}
                {(loading === false && usr.id === undefined) && (<NotFound />)}

                {(loading === false && usr.id) && (
                    <div className="media d-block d-lg-flex">
                        <div className="profile-sidebar pd-lg-r-25">
                            <div className="row">
                                <div className="col-sm-3 col-md-2 col-lg-12">
                                    <div className="avatar avatar-xxl avatar-onlines"><img src={usr.avatar_link} className="rounded-circle" alt={usr.username} /></div>
                                </div>
                                <div className="col-sm-8 col-md-7 col-lg-12 mg-t-20 mg-sm-t-0 mg-lg-t-25">
                                    <h5 className="mg-b-2 tx-spacing--1">{usr.fullname}</h5>
                                    <p className="tx-color-03 mg-b-25">@{usr.username}</p>
                                    <div className="d-flex mg-b-25">
                                        {/* <button className="btn btn-xs btn-white flex-fill">Message</button> */}
                                        {usr.id === logg.id && (
                                            <Link to="/user" className="btn btn-xs btn-primary flex-fill mg-l-10s">Edit profile</Link>
                                        )}
                                    </div>

                                    {usr.about && (
                                        <div>
                                            <label className="tx-sans tx-10 tx-semibold tx-uppercase tx-color-01 tx-spacing-1 mg-b-5">About {usr.username}</label>
                                            <p className="tx-13 tx-color-02 mg-b-25">{usr.about}</p>
                                        </div>
                                    )}

                                    {usr.quote && (
                                        <div>
                                            <label className="tx-sans tx-10 tx-semibold tx-uppercase tx-color-01 tx-spacing-1 mg-b-5">{usr.username}'s personal quote</label>
                                            <p className="tx-13 tx-color-02 mg-b-25">{usr.quote}</p>
                                        </div>
                                    )}

                                    <div className="d-flex">
                                        <div className="profile-skillset flex-fill">
                                            <h4>{usr.coins_sf}</h4>
                                            <label>Coins</label>
                                        </div>
                                        {/* <div className="profile-skillset flex-fill">
                                            <h4>437</h4>
                                            <label>Following</label>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-5 col-lg mg-t-40">
                                    {(usr.twitter || usr.instagram || usr.facebook || usr.whatsapp) && (
                                        <label className="tx-sans tx-10 tx-semibold tx-uppercase tx-color-01 tx-spacing-1 mg-b-15">Websites &amp; Social Channel</label>
                                    )}
                                    <ul className="list-unstyled profile-info-list">
                                        {usr.twitter && (
                                            <li><i data-feather="twitter"></i> <a target="_blank" rel="noopener noreferrer" href={`https://twitter.com/${usr.twitter}`}>@{usr.twitter}</a></li>
                                        )}
                                        {usr.instagram && (
                                            <li><i data-feather="instagram"></i> <a target="_blank" rel="noopener noreferrer" href={`https://instagram.com/${usr.instagram}`}>@{usr.instagram}</a></li>
                                        )}
                                        {usr.facebook && (
                                            <li><i data-feather="facebook"></i> <a target="_blank" rel="noopener noreferrer" href={`https://facebook.com/${usr.facebook}`}>@{usr.facebook}</a></li>
                                        )}
                                        {usr.linkedin && (
                                            <li><i data-feather="linkedin"></i> <a target="_blank" rel="noopener noreferrer" href={`https://linkedin.com/in/${usr.linkedin}`}>@{usr.linkedin}</a></li>
                                        )}
                                        {/* <li><i data-feather="whatsapp"></i> <a target="_blank" rel="noopener noreferrer" href={`https://wa.me/234${usr.whatsapp}`}>@{usr.whatsapp}</a></li> */}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="media-body mg-t-40 mg-lg-t-0">
                            <div className="card mg-b-20">
                                <div className="card-body d-flex flex-row justify-content-around">
                                    <div className="profile-skillset flex-fills">
                                        <h4>State</h4>
                                        <label>{usr.state}</label>
                                    </div>
                                    <div className="profile-skillset flex-fills">
                                        <h4>Member since</h4>
                                        <label>{moment(usr.crdate).format('LL')}</label>
                                    </div>
                                    <div className="profile-skillset flex-fills">
                                        <h4>Last active</h4>
                                        <label>{moment(usr.acdate).format('LL')}</label>
                                    </div>
                                </div>
                            </div>

                            <div className="card mg-b-20 mg-lg-b-25">
                                <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                                    <h6 className="tx-uppercase tx-semibold mg-b-0">{usr.username}'s Posts</h6>
                                </div>
                                <div className="card-body pd-20 pd-lg-25">
                                    <Spin spinning={loadingPosts} indicator={func.fspinner_xs}>
                                        {loadingPosts === true && (<div>loading posts...</div>)}
                                        {posts.map(row => (<NewsCard key={row.id} row={row} />))}

                                        {total > limit && !loading && (<Pagination total={total} pageSize={limit} current={currentStep} onChange={(e) => this.nextPrev(e)} />)}
                                    </Spin>
                                </div>
                                {/* <div className="card-footer bg-transparent pd-y-10 pd-sm-y-15 pd-x-10 pd-sm-x-20">
                                <nav className="nav nav-with-icon tx-13">
                                    <a href="" className="nav-link"><i data-feather="thumbs-up"></i> Like</a>
                                    <a href="" className="nav-link"><i data-feather="message-square"></i> Comment</a>
                                    <a href="" className="nav-link"><i data-feather="share"></i> Share</a>
                                </nav>
                            </div> */}
                            </div>

                        </div>
                        {/* <div className="profile-sidebar mg-t-40 mg-lg-t-0 pd-lg-l-25">
                            <div className="row">
                                <div className="col-sm-6 col-md-5 col-lg">
                                    <div className="d-flex align-items-center justify-content-between mg-b-15">
                                        <h6 className="tx-13 tx-uppercase tx-semibold mg-b-0">{usr.username}'s Photos</h6>
                                    </div>

                                    <div className="row row-xxs">
                                        <div className="col-6">
                                            <span className="d-block ht-60 pointer" onClick={() => this.setState({ lightOpen: true })}><img src={usr.avatar_link} className="img-fit-cover" alt={usr.username} /></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                )}

                {lightOpen === true && (
                    <Lightbox
                        mainSrc={lightImages[lightIndex]}
                        nextSrc={lightImages[(lightIndex + 1) % lightImages.length]}
                        prevSrc={lightImages[(lightIndex + lightImages.length - 1) % lightImages.length]}
                        onCloseRequest={() => this.setState({ lightOpen: false })}
                        onMovePrevRequest={() =>
                            this.setState({
                                lightIndex: (lightIndex + lightImages.length - 1) % lightImages.length,
                            })
                        }
                        onMoveNextRequest={() =>
                            this.setState({
                                lightIndex: (lightIndex + 1) % lightImages.length,
                            })
                        }
                    />
                )}
            </React.Fragment>
        )
    }

}

export default UserProfile;