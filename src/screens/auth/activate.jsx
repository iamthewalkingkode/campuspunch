import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as func from '../../utils/functions';

class ActivateForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            submitting: false
        };
    }

    _submit = (e) => {
        e.preventDefault();
        const { form: { validateFields } } = this.props;
        validateFields((err, v) => {
            if (!err) {
                if (v.pin === func.getStorage('otp_pin')) {
                    this.setState({ submitting: true });
                    func.post('authenticate/activate', { username: func.getStorage('otp_username'), type: func.getStorage('otp_type'), phone: func.getStorage('otp_phone') }).then(res => {
                        this.setState({ submitting: false });
                        if (res.status === 200) {
                            func.delStorage('otp_pin');
                            func.delStorage('otp_type');
                            func.delStorage('otp_phone');
                            func.delStorage('otp_country');
                            func.delStorage('otp_username');
                            if (func.getStorage('token')) {
                                // navCtrl.pop();
                            } else {
                                func.setStorage('token', res.token);
                                func.setStorageJson('user', res.user);
                                window.location.replace('/');
                            }
                        } else {
                            message.error(res.result);
                        }
                    });
                }else{
                    message.error('Incorrect activation pin');
                }
            }
        });
    }

    render() {
        const { form: { getFieldDecorator } } = this.props;
        const { submitting } = this.state;

        return (
            <Form hideRequiredMark={false} onSubmit={this._submit}>
                <h3 className="tx-color-01 mg-b-5"><FormattedMessage id="Text.Activate" defaultMessage="Activate your account" /></h3>
                <p className="tx-color-03 tx-16 mg-b-40">We have sent an activation to {func.getStorage('otp_phone')}</p>

                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12">
                                <Form.Item colon={false} label={<FormattedMessage id="Label.Activation" defaultMessage="Activation code" />}>
                                    {getFieldDecorator('pin', {
                                        rules: [{ required: true, message: <span /> }]
                                    })(
                                        <Input autoComplete="off" size="large" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12">
                                <Button type="primary" htmlType="submit" block loading={submitting}>
                                    <FormattedMessage id="Button.Activate" defaultMessage="Activate" />
                                </Button>
                            </div>
                            <div className="col-12">&nbsp;</div>
                            <div className="col-6">
                                <Button type="dark" block loading={submitting}>
                                    <FormattedMessage id="Button.EditNumber" defaultMessage="Edit Number" />
                                </Button>
                            </div>
                            <div className="col-6">
                                <Button type="dark" block onClick={() => this.props.sendPin()} loading={this.props.sendingpin}>
                                    <FormattedMessage id="Button.Resend" defaultMessage="Resend" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        )
    }

}

const Activate = Form.create()(ActivateForm);
export default Activate;