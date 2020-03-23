import React, { Component } from 'react';
import moment from 'moment';
import { Button, message } from 'antd';
import * as func from '../../utils/functions';
import { PayModal } from '../../components';

class BiddingCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false, submitting: false, applyVisible: false, applied: false,
            last: {}, cd: { d: '0', h: '0', m: '0', s: '0' },
            interval: null
        };
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    componentDidMount() {
        const { item, auth: { logg } } = this.props;
        this.setState({ loading: true });
        if (item.id) {
            func.post('bidding/logs', { user: logg.id, item: item.id, level: item.level, limit: 1 }).then(res => {
                this.setState({ loading: false });
                if (res.status === 200) {
                    this.setState({ applied: true }, () => {
                        this.countDown();
                        let interval = setInterval(() => {
                            this.countDown(interval);
                        }, 4000);
                    });
                }
            });
        }
    }

    countDown(interval) {
        const { item } = this.props;
        func.post('settings/countdown', { to: item.end_date }).then(res => {
            this.setState({ cd: res.result, interval });
        });
        func.post('bidding/users', { item: item.id, limit: 1 }).then(res => {
            if (res.status === 200) {
                this.setState({ last: res.result[0] });
            }
        });
    }

    apply() {
        const { item, auth: { logg, token } } = this.props;
        if (logg.wallet >= item.amount) {
            this.setState({ submitting: true });
            func.post('bidding/apply', { user: logg.id, item: item.id, level: item.level, amount: item.amount }).then(res => {
                this.setState({ submitting: false });
                if (res.status === 200) {
                    message.success(`You have applied`);
                    this.props.signInSuccess(token, res.user);
                } else {
                    message.error(res.result);
                }
            });
        } else {
            this.setState({ applyVisible: true });
        }
    }

    bid() {
        const { item, auth: { logg, token }, data: { settings } } = this.props;
        let coins = parseInt(settings.coins_bidding);
        if (logg.coins > coins) {
            this.setState({ submitting: true });
            func.post('bidding/bid', { user: logg.id, item: item.id, level: item.level, coins }).then(res => {
                this.setState({ submitting: false });
                if (res.status === 200) {
                    message.success(`Bid placed. You were debited ${coins} coins`);
                    this.props.signInSuccess(token, res.user);
                } else {
                    message.error(res.result);
                }
            });
        } else {
            message.error('You do not have enough coins to bid');
        }
    }

    render() {
        const { loading, submitting, applyVisible, applied, cd, last } = this.state;
        const { item } = this.props;

        return (
            <React.Fragment>
                <div className="">
                    {(loading === true || item.id === undefined) && (
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex flex-row align-items-center justify-content-center" style={{ minHeight: 350 }}>
                                    <div className="text-center">
                                        <div class="spinner-grow text-primary"></div>
                                        <div>loading item...</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {(loading === false && item.id) && (
                        <div className="card">
                            <div className="card-body">
                                <div className="text-center">
                                    <div class="pos-relative">
                                        <div class="marker marker-ribbon marker-primary pos-absolute t-10 l-10">Level {item.level}</div>
                                        <img src={item.image_link} alt={`${item.name} - CampusPunch`} class="img-fluid rounded" style={{ height: 200 }} />
                                    </div>
                                    {cd.s > 0 && (<h1 className="pd-t-10 text-danger"><b>{cd.d}:{cd.h}:{cd.m}:{cd.s}</b></h1>)}
                                    {cd.s <= 0 && (<h1 className="pd-t-10 text-danger"><b>0:0:0:0</b></h1>)}
                                    {last.id && (<p>Last Bidder: {last.user.username}</p>)}
                                    <div className="text-left m-lg">
                                        <p className="pd-t-10" dangerouslySetInnerHTML={{ __html: item.description }}></p>
                                        <p><b className="text-primary">Bid Expiration:</b> {moment(item.end_date).format('LLLL')}</p> <p></p>
                                        <p><b className="text-primary">How to bid:</b> Always make sure you are the last bidder before the timer ends (turns 0:0:0) or before th bid expiration time</p> <p></p>
                                        <p><b className="text-primary">Note:</b> You have to bid at least 500 coins to win.</p>
                                    </div>
                                    <div style={{}}>
                                        {applied === false && (
                                            <Button type="primary" block onClick={() => this.apply()} loading={submitting}>Apply ₦{item.amount}</Button>
                                        )}
                                        {(applied === true) && (
                                            <Button type="primary" block outline disabled={cd.s <= 0} loading={submitting} onClick={() => this.bid()}>Bid</Button>
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
                        this.props.signInSuccess(this.props.auth.token, e.user);
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