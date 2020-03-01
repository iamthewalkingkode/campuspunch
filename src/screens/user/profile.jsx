import React, { Component } from 'react';
// import { Form, Input, Button, message } from 'antd';
import * as func from '../../utils/functions';
// import { Link } from 'react-router-dom';

import { Loading } from '../../components';

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usr: {},
            loading: false,
            username: ''
        };
    }

    componentDidMount() {
        var uri = this.props.location.pathname.split('/');
        var username = uri[2];
        if (username) {
            this.setState({ username }, () => {
                this.props.setMetaTags({ title: username });
                this.setState({ loading: true });
                func.post('users', { username, limit: 1 }).then(res => {
                    this.setState({ loading: false });
                    if (res.status === 200) {
                        var usr = res.result[0];
                        setTimeout(() => {
                            window.init();
                        }, 200);
                        this.props.setMetaTags({ title: usr.username, description: usr.about });
                        this.setState({ usr });
                    }
                });
            });
        }
    }

    render() {
        // const { auth: { logg } } = this.props;
        const { loading, usr, username } = this.state;

        return (
            <React.Fragment>
                {loading === true && (<Loading text={`loading ${username}'s profile...`} />)}

                {loading === false && (
                    <div className="media d-block d-lg-flex">
                        <div className="profile-sidebar pd-lg-r-25">
                            <div className="row">
                                <div className="col-sm-3 col-md-2 col-lg">
                                    <div className="avatar avatar-xxl avatar-online"><img src={usr.avatar_link} className="rounded-circle" alt={usr.username} /></div>
                                </div>
                                <div className="col-sm-8 col-md-7 col-lg mg-t-20 mg-sm-t-0 mg-lg-t-25">
                                    <h5 className="mg-b-2 tx-spacing--1">{usr.fullname}</h5>
                                    <p className="tx-color-03 mg-b-25">@{usr.username}</p>
                                    <div className="d-flex mg-b-25">
                                        <button className="btn btn-xs btn-white flex-fill">Message</button>
                                        <button className="btn btn-xs btn-primary flex-fill mg-l-10">Follow</button>
                                    </div>

                                    <p className="tx-13 tx-color-02 mg-b-25">{usr.about}</p>

                                    <div className="d-flex">
                                        <div className="profile-skillset flex-fill">
                                            <h4>{usr.points_sf}</h4>
                                            <label>Coins</label>
                                        </div>
                                        <div className="profile-skillset flex-fill">
                                            <h4>437</h4>
                                            <label>Following</label>
                                        </div>
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
                                        {/* <li><i data-feather="whatsapp"></i> <a target="_blank" rel="noopener noreferrer" href={`https://wa.me/234${usr.whatsapp}`}>@{usr.whatsapp}</a></li> */}
                                    </ul>
                                </div>
                                {/* <div className="col-sm-6 col-md-5 col-lg mg-t-40">
                                <label className="tx-sans tx-10 tx-semibold tx-uppercase tx-color-01 tx-spacing-1 mg-b-15">Contact Information</label>
                                <ul className="list-unstyled profile-info-list">
                                    <li><i data-feather="briefcase"></i> <span className="tx-color-03">Bay Area, San Francisco, CA</span></li>
                                    <li><i data-feather="home"></i> <span className="tx-color-03">Westfield, Oakland, CA</span></li>
                                    <li><i data-feather="smartphone"></i> <a href="">(+1) 012 345 6789</a></li>
                                    <li><i data-feather="phone"></i> <a href="">(+1) 987 654 3201</a></li>
                                    <li><i data-feather="mail"></i> <a href="">me@fenchiumao.me</a></li>
                                </ul>
                            </div> */}
                            </div>
                        </div>
                        <div className="media-body mg-t-40 mg-lg-t-0 pd-lg-x-10">

                            <div className="card mg-b-20 mg-lg-b-25">
                                <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                                    <h6 className="tx-uppercase tx-semibold mg-b-0">{usr.username}'s Posts</h6>
                                </div>
                                <div className="card-body pd-20 pd-lg-25">
                                    <div className="media align-items-center mg-b-20">
                                        <div className="avatar avatar-online"><img src="../../assets/img/img15.jpg" className="rounded-circle" alt="" /></div>
                                        <div className="media-body pd-l-15">
                                            <h6 className="mg-b-3">Dyanne Aceron</h6>
                                            <span className="d-block tx-13 tx-color-03">Cigarette Butt Collector</span>
                                        </div>
                                        <span className="d-none d-sm-block tx-12 tx-color-03 align-self-start">5 hours ago</span>
                                    </div>
                                    <p className="mg-b-20">Our team is expanding again. We are looking for a Product Manager and Software Engineer to drive our new aspects of our capital projects. If you're interested, please drop a comment here or simply message me. <a href="">#softwareengineer</a> <a href="">#engineering</a></p>

                                    <div className="bd bg-gray-50 pd-y-15 pd-x-15 pd-sm-x-20">
                                        <h6 className="tx-15 mg-b-3">We're hiring of Product Manager</h6>
                                        <p className="mg-b-0 tx-14">Full-time, $60,000 - $80,000 annual</p>
                                        <span className="tx-13 tx-color-03">Bay Area, San Francisco, CA</span>
                                    </div>
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
                        <div className="profile-sidebar mg-t-40 mg-lg-t-0 pd-lg-l-25">
                            <div className="row">
                                <div className="col-sm-6 col-md-5 col-lg mg-t-40">
                                    <div className="d-flex align-items-center justify-content-between mg-b-15">
                                        <h6 className="tx-13 tx-uppercase tx-semibold mg-b-0">{usr.username}'s Photos</h6>
                                    </div>

                                    <div className="row row-xxs">
                                        <div className="col-4">
                                            <a href="" className="d-block ht-60"><img src={usr.avatar_link} className="img-fit-cover" alt={usr.username} /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        )
    }

}

export default UserProfile;