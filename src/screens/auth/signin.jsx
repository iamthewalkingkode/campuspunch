import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import * as qs from 'query-string';
import * as func from '../../utils/functions';

const parsed = qs.parse(window.location.search);
class SiginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            submitting: false, errorMessage: ''
        };

        this.props.setMetaTags({ title: 'Login to your account', description: '', keywords: '' });
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    _submit = (e) => {
        e.preventDefault();
        const { form: { validateFields } } = this.props;
        validateFields((err, v) => {
            if (!err) {
                this.setState({ submitting: true, errorMessage: '' });
                func.post('authenticate', v).then(res => {
                    this.setState({ submitting: false });
                    if (res.status === 200) {
                        func.setStorage('token', res.token);
                        func.setStorageJson('user', res.user);
                        window.location.replace(`${parsed.redirect || this.props.redirect || ''}`);
                    } else {
                        this.setState({ errorMessage: res.result });
                    }
                });
            }
        });
    }

    render() {
        const { form: { getFieldDecorator } } = this.props;
        const { submitting, errorMessage } = this.state;

        return (
            <React.Fragment>
                <Form hideRequiredMark={false} onSubmit={this._submit}>
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-5" style={{ float: 'none', margin: '0 auto' }}>
                            {errorMessage && (
                                <div className="alert alert-danger animated shake" role="alert">{errorMessage}</div>
                            )}
                            <div className="text-center pd-b-20">
                                <h3 className="tx-color-01 mg-b-5">Welcome Back!</h3>
                                <p className="mg-b-0 block">Please signin to continue.</p>
                            </div>
                            <div className={errorMessage ? 'animated shake' : ''} style={{ boxShadow: '0 0 3px #CACACA', padding: '35px 25px' }}>
                                <div className="">
                                    <div className="d-flex justify-content-between mg-b-5">
                                        <label className="mg-b-0-f">Username</label>
                                    </div>
                                    <Form.Item colon={false} label={null}>
                                        {getFieldDecorator('username', {
                                            rules: [{ required: true, message: 'Username is required' }]
                                        })(
                                            <Input autoComplete="off" size="large" disabled={submitting} />
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="">
                                    <div className="d-flex justify-content-between mg-b-5">
                                        <label className="mg-b-0-f">Password</label>
                                        <Link to="/user/reset" className="tx-13 pointer">Forgot password?</Link>
                                    </div>
                                    <Form.Item colon={false} label={null}>
                                        {getFieldDecorator('password', {
                                            rules: [{ required: true, message: 'Password is required' }]
                                        })(
                                            <Input.Password autoComplete="off" size="large" disabled={submitting} />
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="">
                                    <Button type="primary" htmlType="submit" block loading={submitting}>Sign In</Button>
                                </div>
                            </div>
                            <div className="text-center mg-t-25 small">
                                Don't have an account? <Link to="/user/signup">Sign up here</Link>
                            </div>
                        </div>
                    </div>
                </Form>
            </React.Fragment>
        )
    }

}

const Login = Form.create()(SiginForm);
export default Login;