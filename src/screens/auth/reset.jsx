import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import * as func from '../../utils/functions';
import { Link } from 'react-router-dom';

class ResetForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            submitting: false,
            errorMessage: '', code: '',
            level: 1
        };
    }

    componentDidMount() {
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        var uri = this.props.location.pathname.split('/');
        if (uri[3]) {
            this.setState({ level: 2, code: uri[3] });
            this.props.setMetaTags({ title: 'Change your password', description: '', keywords: '' });
        } else {
            this.props.setMetaTags({ title: 'Forgot password', description: '', keywords: '' });
        }
    }

    confirmPassword = (rule, value, callback) => {
        if (!value) {
            callback();
        }
        if (value !== this.props.form.getFieldValue('password')) {
            callback('Passwords do not match');
        }
        callback();
    };

    _submit = (e) => {
        e.preventDefault();
        const { code } = this.state;
        const { form: { validateFields } } = this.props;
        validateFields((err, v) => {
            if (!err) {
                this.setState({ submitting: true, errorMessage: '' });
                if (this.state.level === 1) {
                    func.post('authenticate/reset', v).then(res => {
                        this.setState({ submitting: false });
                        if (res.status === 200) {
                            message.success(res.result);
                        } else {
                            this.setState({ errorMessage: res.result });
                        }
                    });
                } else {
                    v['code'] = code;
                    func.post('authenticate/reset', v).then(res => {
                        this.setState({ submitting: false });
                        if (res.status === 200) {
                            message.success(res.result);
                            this.props.history.push('/user/signin');
                        } else {
                            this.setState({ errorMessage: res.result });
                        }
                    });
                }
            }
        });
    }

    render() {
        const { form: { getFieldDecorator } } = this.props;
        const { submitting, level, errorMessage } = this.state;

        return (
            <React.Fragment>
                <Form hideRequiredMark={false} onSubmit={this._submit}>
                    {level === 1 && (
                        <div className="row">
                            <div className="col-12 col-md-6 col-lg-5" style={{ float: 'none', margin: '0 auto' }}>
                                {errorMessage && (
                                    <div className="alert alert-danger animated shake" role="alert">{errorMessage}</div>
                                )}
                                <div className="text-center pd-b-20">
                                    <h3 className="tx-color-01 mg-b-5">Reset your password</h3>
                                    <p className="mg-b-0 block">Enter your username/email and we will send you a reset link.</p>
                                </div>
                                <div className={errorMessage ? 'animated shake' : ''} style={{ boxShadow: '0 0 3px #CACACA', padding: '35px 25px' }}>
                                    <div className="">
                                        <Form.Item colon={false} label="Username/Email">
                                            {getFieldDecorator('username', {
                                                rules: [{ required: true, message: 'Username/Email is required' }]
                                            })(
                                                <Input autoComplete="off" size="large" disabled={submitting} />
                                            )}
                                        </Form.Item>
                                    </div>
                                    <div className="">
                                        <Button type="primary" htmlType="submit" block loading={submitting}>
                                            Continue
                                        </Button>
                                    </div>
                                </div>
                                <div className="text-center mg-t-25 small">
                                    Remembered your password? <Link to="/user/signin">Sign in here</Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {level === 2 && (
                        <div className="row">
                            <div className="col-5" style={{ float: 'none', margin: '0 auto' }}>
                                {errorMessage && (
                                    <div className="alert alert-danger animated shake" role="alert">{errorMessage}</div>
                                )}
                                <div className="text-center pd-b-20">
                                    <h3 className="tx-color-01 mg-b-5">Change your password</h3>
                                    <p className="mg-b-0 block">Enter your new password.</p>
                                </div>
                                <div className={errorMessage ? 'animated shake' : ''} style={{ boxShadow: '0 0 3px #CACACA', padding: '35px 25px' }}>
                                    <div className="">
                                        <Form.Item colon={false} label="New password">
                                            {getFieldDecorator('password', {
                                                rules: [{ required: true, message: 'Password is required' }]
                                            })(
                                                <Input type="password" autoComplete="off" size="large" disabled={submitting} />
                                            )}
                                        </Form.Item>
                                    </div>
                                    <div className="">
                                        <Form.Item colon={false} label="Confirm assword">
                                            {getFieldDecorator('cpassword', {
                                                rules: [{ required: true, message: 'Password is required' }, { validator: this.confirmPassword }]
                                            })(
                                                <Input type="password" autoComplete="off" size="large" disabled={submitting} />
                                            )}
                                        </Form.Item>
                                    </div>
                                    <div className="">
                                        <Button type="primary" htmlType="submit" block loading={submitting}>
                                            Continue
                                        </Button>
                                    </div>
                                </div>
                                <div className="text-center mg-t-25 small">
                                    Remembered your password? <Link to="/user/signin">Sign in here</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </Form>
            </React.Fragment>
        )
    }

}

const Reset = Form.create()(ResetForm);
export default Reset;