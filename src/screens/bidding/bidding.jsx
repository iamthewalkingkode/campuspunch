import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import * as func from '../../utils/functions';
import { Advert } from '../../components';

import BiddingCard from './bidding.card';
import { Link } from 'react-router-dom';

class BiddingScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            winners: [], items: [],
            loading: false, submitting: false, visible: false,
            screen: '', id: 0,
        };
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Bidding', description: '', keywords: '' });
        this.props.setHeaderBottom({ h1: 'Bidding', h3: '', p: '', image: 'banner/bidding.png' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });

        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.bidItems();
        this.prevWinners();
    }

    bidItems() {
        this.setState({ loading: true });
        func.post('bidding', { status: 1, limit: 3, active: 'yes', orderby: 'level_asc' }).then(res => {
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

    render() {
        const { visible, loading, items, winners } = this.state;
        const { auth: { authenticated, logg } } = this.props;

        return (
            <React.Fragment>
                <Advert position="top" />
                <div className="row">
                    <div className="col-12 col-sm-9 col-lg-9">
                        <div>
                            {authenticated && (
                                <div className="card mg-b-20">
                                    <div className="card-body bg-gray-100 d-flex flex-row justify-content-around">
                                        <div className="profile-skillset flex-fills">
                                            <h5>Wallet</h5>
                                            <label style={{ fontSize: 12 }}>₦{logg.wallet_nf}</label>
                                        </div>
                                        {/* <div className="profile-skillset flex-fills">
                                            <h5>Your level</h5>
                                            <label style={{ fontSize: 12 }}>Level {logg.bid_level}</label>
                                        </div> */}
                                        <div className="profile-skillset flex-fills">
                                            <h5>Your coins</h5>
                                            <label style={{ fontSize: 12 }}>{logg.coins_nf}</label>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {authenticated === false && (
                                <div className="alert alert-info">
                                    You need to <Link to="/user/signin?redirect=bidding">Sign in</Link> or <Link to="/user/signup?redirect=bidding">Sign up</Link> to be able to bid
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
                        </div>
                    </div>

                    <div className="col-12 col-sm-3 col-lg-3">
                        <div className="mg-b-20">
                            <h6 className="tx-uppercase tx-semibold mg-b-5">Campus bidding</h6>
                            <p>Though, the Board also made efforts at training the blind candidates on the equipment before the examination, it is apparent that the two days to one week training and exposure to the sophisticated gadgets are inadequate and have little impact on them before the examination. The Association pleaded that the Board takes another look at our approach in order to have value for the resources that we are committing to their teaching, learning and assessment. <span className="text-primary pointer" onClick={() => this.setState({ visible: true })}>Read more</span></p>
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

                <Modal title="Campus bidding" visible={visible} onCancel={() => this.setState({ visible: false })} footer={[
                    <Button key="back" onClick={() => this.setState({ visible: false })}>
                        Okay
                    </Button>
                ]}>
                    <p>Though, the Board also made efforts at training the blind candidates on the equipment before the examination, it is apparent that the two days to one week training and exposure to the sophisticated gadgets are inadequate and have little impact on them before the examination. The Association pleaded that the Board takes another look at our approach in order to have value for the resources that we are committing to their teaching, learning and assessment.</p>
                    <p>Firstly after our interaction, the Board appealed to some universities and other tertiary institutions to admit all the blind candidates that met the minimum requirement for registration in the 2016 Unified Tertiary Matriculation Examination and I am happy to inform this august gathering that all candidates who fall into this category have been admitted. I thank the Vice Chancellors and Provosts who graciously partnered with us to admit the blind candidates into their institutions.</p>
                    <p>Secondly, the Board has approached the Digital Bridge Institute to partner with it to set up Visually Impaired Candidates centres where the blind candidates can be trained all year round and which can also serve as examination centres for them. The Institute has agreed to set up these dedicated centres in Abuja, Lagos and Kano in 2018 and the Board will support the centres with all necessary inputs that would make teaching, learning and assessment at the centres seamless.</p>
                    <p>The centres would also have residential accommodation for the blind candidates and their guides.</p>
                </Modal>
            </React.Fragment>
        )
    }

}

export default BiddingScreen;