import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, message } from 'antd';
import * as func from '../../utils/functions';
import { Advert, PayModal } from '../../components';

import BiddingCard from './components/bidding.card';

class BiddingHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            winners: [], items: [], payModal: {},
            loading: false, submitting: false, visible: false, appliedPro: false, applyingPro: false,
            screen: '', id: 0, referralTotal: 0,
            user: parseInt((this.props.match.params.user || '').split('.')[1])
        };
    }

    componentDidMount() {
        const { _auth: { authenticated, logg } } = this.props;
        this.props.setMetaTags({ title: 'Bid and win free laptops, tablets & phones', description: 'Campus Bidding goal is to help students get all the gadgets they need to learn', keywords: '' });
        this.props.setHeaderBottom({ h1: 'Bidding', h3: '', p: '', image: 'banner/bidding.jpg' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });

        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.bidItems();
        this.prevWinners();

        if (this.state.user) {
            this.props.setMetaTags({ title: 'Get a Free Macbook Apple Pro Laptop | Students Only', description: 'Register with N3,200 and win free Macbook Apple Pro Laptop', keywords: '' });
            this.props.setHeaderBottom({ h1: 'Bidding PRO', h3: '', p: '', image: 'banner/bidding.jpg' });
        }

        if (authenticated === true) {
            func.post('bidding.pro/logs', { user: logg.id }).then(res => {
                if (res.status === 200) {
                    this.setState({ appliedPro: true });
                }
            });
            func.post('bidding.pro/referrers', { referrer: logg.id }).then(res => {
                if (res.status === 200) {
                    this.setState({ referralTotal: res.count });
                }
            });
        }
    }

    bidItems() {
        this.setState({ loading: true });
        func.post('bidding', { status: 1, limit: 4, active: 'yes', orderby: 'level_asc' }).then(res => {
            this.setState({ loading: false });
            if (res.status === 200) {
                this.setState({ items: res.result });
            }
        });
    }

    prevWinners() {
        func.post('bidding/winners', { limit: 4 }).then(res => {
            if (res.status === 200) {
                this.setState({ winners: res.result });
            }
        });
    }

    applyPro = () => {
        const { _auth: { logg } } = this.props;
        if (logg.wallet >= 3200) {
            this.setState({ applyingPro: true });
            func.post('bidding.pro/apply', { user: this.props._auth.logg.id, amount: 3200, referrer: this.state.user }).then(res => {
                this.setState({ applyingPro: false });
                if (res.status === 200) {
                    this.setState({ appliedPro: true });
                    this.props.signInSuccess(res.user);
                } else {
                    message.error(res.result);
                }
            });
        } else {
            this.setState({ payModal: { amount: 3200, title: 'Apply to Bidding PRO' } })
        }
    }

    render() {
        const { visible, loading, items, winners, payModal, appliedPro, applyingPro, referralTotal } = this.state;
        const { _auth: { authenticated, logg } } = this.props;

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12 col-sm-9 col-lg-9 mg-b-25">
                        <div>
                            {authenticated && (
                                <div className="card mg-b-20">
                                    <div className="card-body bg-gray-100 d-flex flex-row justify-content-around">
                                        <div className="profile-skillset flex-fills text-center">
                                            <h5>Wallet</h5>
                                            <label style={{ fontSize: 12 }}>₦{logg.wallet_nf}</label>
                                        </div>
                                        <div className="profile-skillset flex-fills text-center">
                                            <h5>Your coins</h5>
                                            <label style={{ fontSize: 12 }}>{logg.coins_nf}</label>
                                        </div>
                                        {appliedPro === true && (
                                            <div className="profile-skillset flex-fills text-center">
                                                <h5>Bidding Pro</h5>
                                                <label style={{ fontSize: 12 }}>{referralTotal} referrals</label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {authenticated === false && (
                                <div className="alert alert-info">
                                    You need to <Link to="/user/signin?redirect=bidding">Sign in</Link> or <Link to="/user/signup?redirect=bidding">Sign up</Link> to be able to bid
                                </div>
                            )}
                            {!loading && appliedPro === false && (
                                <div className="card mg-b-20">
                                    <div className="card-body bg-gray-200 d-flex flex-row justify-content-around">
                                        <div className="profile-skillset flex-fills text-center">
                                            <h5><i className="fa fa-star"></i> <br /> Bidding PRO</h5>
                                            <div className="mg-b-20 mg-t-20" style={{ fontSize: 14 }}>
                                                Win an instant MacBook Apple Laptop in a month
                                            </div>
                                            <Button type="primary" disabled={!authenticated} onClick={this.applyPro}>Apply to Bidding PRO (₦3,200)</Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {!loading && appliedPro === true && authenticated === true && (
                                <div className="card mg-b-20">
                                    <div className="card-body bg-gray-200 d-flex flex-row justify-content-around">
                                        <div className="profile-skillset flex-fills text-center">
                                            <h5><i className="fa fa-star"></i> <br /> Bidding PRO</h5>
                                            <div className="mg-b-20 mg-t-20" style={{ fontSize: 14 }}>
                                                Here is your bidding affiliate link: <br />
                                                <span className="text-primary">{window.location.protocol + '//'}{window.location.host}/bidding/pro/{logg.username}.{logg.id}</span> <br />
                                                Invite just 2 persons with this link and you are on your way to own brand new laptops and phones in a month.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="row">
                            <div className="col-12 col-sm-6 col-lg-6">
                                {(loading === true || (items[0] || {}).id) && (<BiddingCard item={items[0] || {}} {...this.props} />)}
                            </div>
                            <div className="col-12 col-sm-6 col-lg-6">
                                {(loading === true || (items[1] || {}).id) && (<BiddingCard item={items[1] || {}} {...this.props} />)}
                            </div>
                            <div className="col-12 mg-t-20">
                                <Advert position="top" />
                            </div>
                            <div className="col-12 col-sm-6 col-lg-6">
                                {(loading === true || (items[2] || {}).id) && (<BiddingCard item={items[2] || {}} {...this.props} />)}
                            </div>
                            <div className="col-12 col-sm-6 col-lg-6">
                                {(loading === true || (items[3] || {}).id) && (<BiddingCard item={items[3] || {}} {...this.props} />)}
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-3 col-lg-3">
                        <div className="mg-b-20">
                            <h6 className="tx-uppercase tx-semibold mg-b-5">Campus bidding</h6>
                            <div><b>Fresher Bidding</b>: is the bidding where the highest bidder goes home with the latest phones, tablets and laptops using either N100, N200 or N300 only.</div>
                            <div><b>Bidding Pro</b>: is the bidding affiliate program where one registers with N3,200, then invites just 2 people and get to own the latest laptops, tablets and phones within a month. <span className="text-primary pointer" onClick={() => this.setState({ visible: true })}>Read more</span></div>
                            <hr />

                            <Advert position="sidebar" />

                            <div className="mg-b-20">
                                <h6 className="tx-uppercase tx-semibold mg-b-5">Previous winners</h6>
                                <ul className="list-group">
                                    {winners.map(win => (
                                        <li key={win.id} className="list-group-item">
                                            <div className="tx-semibold">{win.winner.username}</div>
                                            <small className="text-muted">Level {win.level} • {win.name}</small>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Advert position="sidebar" />
                        </div>
                    </div>
                </div>

                <Modal title="Campus bidding" visible={visible} width={600} onCancel={() => this.setState({ visible: false })} footer={[
                    <Button key="back" onClick={() => this.setState({ visible: false })}>
                        Okay
                    </Button>
                ]}>
                    <div className="text-muted"><h4>How Bidding Works</h4></div>
                    <div>&nbsp;</div>
                    <div>Campus Bidding is presented in two models: <b>Fresher Bidding</b> and <b>Bidding Pro</b></div>
                    <div><b>Fresher Bidding</b>: is the bidding where the highest bidder goes home with the latest phones, tablets and laptops using either N100, N200 or N300 only.</div>
                    <div><b>Bidding Pro</b>: is the bidding affiliate program where one registers with N3,200, then invites just 2 people and get to own the latest laptops, tablets and phones within a month.</div>
                    
                    <div>&nbsp;</div>
                    <div className="text-muted"><h4>How to Bid in Fresher Bidding</h4></div>
                    <div>&nbsp;</div>
                    <div>They are 3 levels in Fresher Bidding where you pay either N100, N200 or N300 to bid in level 1, 2 and 3 respectively.</div>
                    <ul>
                        <li>Decide which level you want to bid in</li>
                        <li>Apply for the level</li>
                        <li>Gather coins by making comments and post on the news page</li>
                        <li>Now go to the bidding page and bid the coins you have gathered.</li>
                        <li>Bid at least 500 coins</li>
                        <li>Then come back 10mins to the bid expiration time to complete your bidding</li>
                        <li>Make sure to be the highest bidder to win the bid item</li>
                    </ul>
                    <div>This looks like some fun game, but you’d be surprised to learn that <b>Bidding Pro</b> is where the real fun gets started</div>
                    
                    <div>&nbsp;</div>
                    <div className="text-muted"><h4>How to Bid in Bidding Pro</h4></div>
                    <div>&nbsp;</div>
                    <div>Here is the bidding affiliate program where with just N3,200 you are entitled to an Apple laptop, a Samsung tablet, an Iphone and the latest Tecno phone within a month. How?</div>
                    <ul>
                        <li>Apply for Bidding Pro with N3,200</li>
                        <li>Get your bidding affiliate referral link instantly</li>
                        <li>Then move sharply to invite 2 persons with your referral link</li>
                        <li>Once you invite 2 persons your N3,200 is refunded back to you and from that 2 referral you make six climbs to own a Macpro book Apple laptop, a Samsung tablet and 2 phones</li>
                    </ul>
                    <div className="mg-t-20 text-center">
                        <Link to="/article/bidding-pro-all-you-need-to-know.4308">Learn more</Link>
                    </div>
                </Modal>

                <Modal title={null} visible={applyingPro} footer={null} closable={false} maskClosable={false} centered>
                    <div className="text-center">
                        applying to Bidding pro, please wait...
                    </div>
                </Modal>

                <PayModal
                    {...this.props}
                    visible={payModal.amount ? true : false}
                    amount={payModal.amount}
                    type="bidding-pro"
                    // payModeDefault="zoranga"
                    title={payModal.title}
                    onCancel={() => this.setState({ payModal: {} })}
                    paySuccess={(e) => {
                        this.props.signInSuccess(e.user);
                        setTimeout(() => {
                            this.applyPro();
                        }, 100);
                    }}
                    paySuccessData={payModal}
                />
            </React.Fragment>
        )
    }

}

export default BiddingHome;