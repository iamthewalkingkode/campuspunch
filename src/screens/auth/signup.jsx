import React, { Component } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { Link } from 'react-router-dom';
import * as func from '../../utils/functions';

class SignupForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            submitting: false
        };

        this.props.setMetaTags({ title: 'Create new account' });
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

    _signup = (e) => {
        e.preventDefault();
        const { form: { validateFields } } = this.props;
        validateFields((err, v) => {
            if (!err) {
                this.setState({ submitting: true, errorMessage: '' });
                v['cpassword'] = undefined;
                func.post('authenticate/signup', v).then(res => {
                    this.setState({ submitting: false });
                    if (res.status === 200) {
                        func.setStorage('token', res.token);
                        func.setStorageJson('user', res.data);
                        window.location.replace(`/`);
                    } else {
                        this.setState({ errorMessage: res.result });
                    }
                });
            }
        });
    }
    _activate = (e) => {
        e.preventDefault();

    }

    render() {
        const { form: { getFieldDecorator }, utils: { studentCategories, states, schools } } = this.props;
        const { submitting, errorMessage } = this.state;

        return (
            <Form hideRequiredMark={false} onSubmit={this._signup}>
                <div className="row">
                    <div className="col-12 col-md-10 col-lg-7" style={{ float: 'none', margin: '0 auto' }}>
                        {errorMessage && (
                            <div class="alert alert-danger animated shake" role="alert">{errorMessage}</div>
                        )}
                        <div className="text-center pd-b-20">
                            <h3 className="tx-color-01 mg-b-5">Create New Account!</h3>
                            <p className="mg-b-0 block">It's free to signup and only takes a minute..</p>
                        </div>
                        <div className={`${errorMessage ? 'animated shake' : ''}`} style={{ boxShadow: '0 0 3px #CACACA', padding: '35px 25px' }}>
                            <div className="row">
                                <div className="col-6">
                                    <Form.Item colon={false} label="Username">
                                        {getFieldDecorator('username', {
                                            rules: [{ required: true }]
                                        })(
                                            <Input autoComplete="off" size="large" disabled={submitting} />
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-6">
                                    <Form.Item colon={false} label="Category">
                                        {getFieldDecorator('category', {
                                            rules: [{ required: true }]
                                        })(
                                            <Select autoComplete="off" size="large" disabled={submitting}>
                                                {studentCategories.map(category => (
                                                    <Select.Option key={category} value={category}>{category}</Select.Option>
                                                ))}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-6">
                                    <Form.Item colon={false} label="Email address">
                                        {getFieldDecorator('email', {
                                            rules: [{ required: true }, { type: 'email' }]
                                        })(
                                            <Input autoComplete="off" size="large" disabled={submitting} />
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-6">
                                    <Form.Item colon={false} label="Phone number">
                                        {getFieldDecorator('phone', {
                                            rules: [{ required: true }]
                                        })(
                                            <Input autoComplete="off" size="large" addonBefore="+234" disabled={submitting} />
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-6">
                                    <Form.Item colon={false} label="State of residence">
                                        {getFieldDecorator('state', {
                                            rules: [{ required: true }]
                                        })(
                                            <Select showSearch={true} autoComplete="off" size="large" disabled={submitting}>
                                                {states.map(state => (
                                                    <Select.Option key={state} value={state}>{state}</Select.Option>
                                                ))}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-6">
                                    <Form.Item colon={false} label="School/Campus">
                                        {getFieldDecorator('school', {
                                            rules: [{ required: true }]
                                        })(
                                            <Select showSearch={true} autoComplete="off" size="large" disabled={submitting}>
                                                {schools.map(sch => (
                                                    <Select.Option key={sch.id} value={sch.id}>{sch.name}</Select.Option>
                                                ))}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-6">
                                    <Form.Item colon={false} label="Password">
                                        {getFieldDecorator('password', {
                                            rules: [{ required: true }]
                                        })(
                                            <Input type="password" autoComplete="off" size="large" disabled={submitting} />
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-6">
                                    <Form.Item colon={false} label="Confirm password">
                                        {getFieldDecorator('cpassword', {
                                            rules: [{ required: true }, { validator: this.confirmPassword }]
                                        })(
                                            <Input type="password" autoComplete="off" size="large" disabled={submitting} />
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-12">
                                    <Button type="primary" htmlType="submit" block loading={submitting}>Sign Up</Button>
                                </div>
                            </div>

                        </div>
                        <div className="text-center mg-t-25 small">
                            Already have an account? <Link to="/user/signin">Sign in here</Link>
                        </div>
                    </div>
                </div>
            </Form>
        )
    }

}

const Signup = Form.create()(SignupForm);
export default Signup;