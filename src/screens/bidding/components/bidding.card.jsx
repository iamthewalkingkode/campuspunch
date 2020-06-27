import React, { Component } from 'react';
import moment from 'moment';
import { Button, message } from 'antd';
import * as func from '../../../utils/functions';
import { PayModal } from '../../../components';
import publicIp from 'public-ip';

const successMsg = ['You\'re a pro in bidding!', 'You\'re a few coins from winning!', 'You\'re not far from winning, keep bidding!'];
class BiddingCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false, submitting: false, applyVisible: false, applied: false, lastMinute: false,
            last: {}, cd: { d: '0', h: '0', m: '0', s: '0' },
            interval: null, myBid: 0
        };
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    componentDidMount() {
        const { item, _auth: { logg, authenticated } } = this.props;
        this.countDown();
        if (item.id && authenticated) {
            // this.setState({ loading: true });
            func.post('settings/countdown', { to: item.end_date }).then(res => {
                this.setState({ cd: res.result });
                if (res.result.d === 0 && res.result.h === 0 && res.result.m <= 10) {
                    this.setState({ lastMinute: true });
                }
            });
            func.post('bidding/logs', { user: logg.id, item: item.id, level: item.level, limit: 1 }).then(res => {
                if (res.status === 200) {
                    this.setState({ applied: true });
                }
            });
            func.post('bidding/users', { user: logg.id, item: item.id, limit: 1 }).then(res => {
                if (res.status === 200) {
                    this.setState({ myBid: res.result[0].coins });
                }
            });
        }
    }

    countDown() {
        const { item } = this.props;
        let interval = setInterval(() => {
            func.post('settings/countdown', { to: item.end_date }).then(res => {
                this.setState({ cd: res.result, interval });
                if (res.result.d === 0 && res.result.h === 0 && res.result.m <= 10) {
                    this.setState({ lastMinute: true });
                }
            });
            func.post('bidding/users', { item: item.id, limit: 1 }).then(res => {
                if (res.status === 200) {
                    this.setState({ last: res.result[0] });
                }
            });
        }, 4000);
    }

    apply() {
        const { item, _auth: { logg } } = this.props;
        if (logg.wallet >= item.amount) {
            this.setState({ submitting: true });
            func.post('bidding/apply', { user: logg.id, item: item.id, level: item.level, amount: item.amount }).then(res => {
                this.setState({ submitting: false });
                if (res.status === 200) {
                    this.setState({ applied: true });
                    message.success(`You have applied`);
                    this.props.signInSuccess(res.user);
                } else {
                    message.error(res.result);
                }
            });
        } else {
            this.setState({ applyVisible: true });
        }
    }

    bid = async () => {
        const { myBid, lastMinute } = this.state;
        const { item, _auth: { logg }, _data: { settings } } = this.props;
        let coins = parseInt(settings.coins_bidding);
        if (logg.coins > coins) {
            if (!lastMinute || (lastMinute && myBid >= 500)) {
                this.setState({ submitting: true });
                const ip = await publicIp.v4({ fallbackUrls: ['https://ifconfig.co/ip'] });
                func.post('bidding/bid', { user: logg.id, item: item.id, level: item.level, coins, ip }).then(res => {
                    this.setState({ submitting: false });
                    if (res.status === 200) {
                        func.shuffle(successMsg);
                        message.success(successMsg[0], 3);
                        this.props.signInSuccess(res.user);
                    } else {
                        message.error(res.result);
                    }
                });
            } else {
                message.error(`Your total bid is ${myBid}. You needed to bid 500 or more coins to bid at this moment`);
            }
        } else {
            message.error('You do not have enough coins to bid');
        }
    }

    render() {
        const { loading, submitting, applyVisible, applied, cd, last, lastMinute, myBid } = this.state;
        const { item, _data: { settings }, _auth: { authenticated } } = this.props;

        return (
            <React.Fragment>
                <div className="">
                    {(loading === true || item.id === undefined) && (
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex flex-row align-items-center justify-content-center" style={{ minHeight: 350 }}>
                                    <div className="text-center">
                                        <div className="spinner-grow text-primary"></div>
                                        <div>loading item...</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {(loading === false && item.id) && (
                        <div className={`card`}>
                            <div className="card-body">
                                <div className="text-center">
                                    <div className="pos-relative">
                                        <div className="marker marker-ribbon marker-primary pos-absolute t-10 l-10">Level {item.level}</div>
                                        <img src={item.image_link} alt={`${item.name} - CampusPunch`} className="img-fluid rounded" style={{ height: 200 }} />
                                    </div>
                                    {cd.s > 0 && (<h1 className="pd-t-10 text-danger"><b>{cd.d}:{cd.h}:{cd.m}:{cd.s}</b></h1>)}
                                    {cd.s <= 0 && (<h1 className="pd-t-10 text-danger"><b>0:0:0:0</b></h1>)}
                                    {last.user && (<p>Last Bidder: {last.user.username} ({last.coins_nf})</p>)}
                                    <div className="text-left m-lg">
                                        <p className="pd-t-10" dangerouslySetInnerHTML={{ __html: item.description }}></p>
                                        <p><b className="text-primary">Bid Expiration:</b> {moment(item.end_date).format('LLLL')}</p> <p></p>
                                        <p><b className="text-primary">How to bid:</b> First bid only 500 coins. Come back 10mins before the bid expiration time and continue bidding. This time the highest bidder wins.</p> <p></p>
                                        <p><b className="text-primary">Note:</b> Only those who bid 500 coins qualify to bid in the last 10mins left.</p>
                                    </div>
                                    <div style={{}}>
                                        {applied === false && (
                                            <Button type="primary" block disabled={!authenticated} onClick={() => this.apply()} loading={submitting}>Apply ₦{item.amount}</Button>
                                        )}
                                        {(applied === true) && (
                                            <Button type="primary" block outline disabled={cd.s <= 0 || (lastMinute && myBid < 500)} loading={submitting} onClick={() => this.bid()}>
                                                Bid ({settings.coins_bidding} coins)
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <PayModal
                    {...this.props}
                    visible={applyVisible}
                    amount={item.amount}
                    type="bidding"
                    // payModeDefault="zoranga"
                    title={`Recharge ${item.level} (₦${item.amount})`}
                    onCancel={() => this.setState({ applyVisible: false })}
                    paySuccess={(e) => {
                        this.props.signInSuccess(e.user);
                        setTimeout(() => {
                            this.apply();
                        }, 100);
                    }}
                    paySuccessData={{ item: item.id }}
                />
            </React.Fragment>
        )
    }

}

export default BiddingCard;