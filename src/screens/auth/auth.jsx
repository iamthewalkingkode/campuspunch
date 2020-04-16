import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import * as authAct from "../../store/auth/_authActions";
import * as utilsAct from "../../store/utils/_utilsActions";
import * as func from '../../utils/functions';
import { Button, message } from 'antd';

import Footer from '../../partials/footer';

import Login from './login';
import Signup from './signup';
import Activate from './activate';
import Verify from './verify';
import Reset from './reset';

class Authenticate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            submitting: false, sendingpin: false,
            maxid: '', row: {},
            navigate: 'index'
        }
    }

    componentDidMount() {
        if (func.getStorage('otp_type') && func.getStorage('otp_phone') && func.getStorage('otp_country')) {
            this.setState({ navigate: 'activate' });
        }
    }

    formChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    sendPin(onOk) {
        const type = func.getStorage('otp_type');
        const phone = func.getStorage('otp_phone');
        this.setState({ sendingpin: true });
        func.post('sendpin', { type, phone }).then(res => {
            this.setState({ sendingpin: false });
            if (res.status === 200) {
                onOk();
                func.setStorage('otp_pin', res.pin);
                message.success(`Pin has been sent to ${phone}`);
            } else {
                message.error(res.result);
            }
        });
    }

    signIn = (username, password, onOk) => {
        this.setState({ submitting: true });
        func.post('authenticate', { username, password }).then(res => {
            this.setState({ submitting: false });
            if (res.status === 200) {
                func.delStorage('otp_pin');
                func.delStorage('otp_type');
                func.delStorage('otp_phone');
                func.delStorage('otp_country');
                func.delStorage('otp_username');
                func.setStorage('token', res.token);
                func.setStorageJson('user', res.user);
                window.location.replace('/');
            } else {
                onOk && onOk();
                message.error(res.result);
            }
        });
    }

    getStarted = (e) => {
        e.preventDefault();
        const { maxid } = this.state;
        this.setState({ submitting: true });
        func.post('maxids/search', { maxid }).then(res => {
            this.setState({ submitting: false });
            if (res.status === 200) {
                var row = res.result;
                if (row.status === 1) {
                    this.setState({ navigate: 'login', row });
                } else {
                    this.setState({ navigate: 'signup', row });
                }
            } else {
                this.setState({ navigate: 'verify' });
            }
        });
    }

    render() {
        const { navigate, submitting, sendingpin, row } = this.state;

        return (
            <React.Fragment>
                <div className="content content-fixed content-auth">
                    <div className="container">
                        <div className="media align-items-stretch justify-content-center ht-100p pos-relative">
                            <div className="media-body align-items-center d-none d-lg-flex">
                                <div className="mx-wd-600">
                                    <img src={`assets/img/use/${navigate}.png`} className="img-fluid" alt="JAVAGroup" />
                                </div>
                            </div>
                            <div className="sign-wrapper mg-lg-l-50 mg-xl-l-60">
                                <div className="wd-100p">

                                    {navigate === 'index' && (
                                        <span>
                                            <h3 className="tx-color-01 mg-b-5"><FormattedMessage id="Text.WelcomeBack" defaultMessage="Welcome Back" /></h3>
                                            <p className="tx-color-03 tx-16 mg-b-40">Welcome back! Please signin to continue.</p>

                                            <form method="post" action="#" onSubmit={this.getStarted}>
                                                <div className="form-group">
                                                    <label><FormattedMessage id="Label.MaxId" defaultMessage="Max ID" /></label>
                                                    <input type="number" name="maxid" id="maxid" autoFocus className="form-control" placeholder="123456" required onChange={this.formChange} />
                                                </div>
                                                <Button type="primary" htmlType="submit" block loading={submitting}>
                                                    <FormattedMessage id="Button.GetStarted" defaultMessage="Get Started" />
                                                </Button>
                                            </form>
                                        </span>
                                    )}

                                    {navigate === 'login' && (
                                        <Login
                                            {...this.props}
                                            row={row} signIn={(u, p, k) => this.signIn(u, p, k)}
                                            setNavigate={(navigate) => this.setState({ navigate })}
                                        />
                                    )}
                                    {navigate === 'signup' && (
                                        <Signup
                                            {...this.props}
                                            row={row} signIn={(u, p, k) => this.signIn(u, p, k)}
                                            setNavigate={(navigate) => this.setState({ navigate })}
                                        />
                                    )}
                                    {navigate === 'activate' && (
                                        <Activate
                                            {...this.props}
                                            sendPin={() => this.sendPin()}
                                            sendingpin={sendingpin}
                                        />
                                    )}
                                    {navigate === 'verify' && (
                                        <Verify
                                            {...this.props}
                                            row={{ maxid: window.$('#maxid').val() }}
                                            setNavigate={(navigate) => this.setState({ navigate })}
                                        />
                                    )}
                                    {navigate === 'reset' && (
                                        <Reset
                                            {...this.props}
                                            row={{ maxid: window.$('#maxid').val() }}
                                            setNavigate={(navigate) => this.setState({ navigate })}
                                            sendPin={(k) => this.sendPin(k)} sendingpin={sendingpin}
                                        />
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </React.Fragment>
        );
    }

}

const mapStateToProps = (state) => ({
    _auth: state.auth,
    _utils: state.utils,
    router: state.router
});

const mapDispatchToProps = (dispatch) => ({
    signInSuccess: (token, data) => {
        dispatch(authAct.signInSuccess(token, data));
    },
    setSetSettings: (key, value) => {
        dispatch(utilsAct.setSetSettings(key, value));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);