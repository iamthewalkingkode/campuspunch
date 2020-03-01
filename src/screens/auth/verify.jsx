import React, { Component } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as func from '../../utils/functions';

class VerifyForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            country: 'gh@+233@Ghana',
            submitting: false
        };
    }

    _submit = (e) => {
        e.preventDefault();
        const { form: { validateFields } } = this.props;
        validateFields((err, v) => {
            if (!err) {
                var country = this.state.country.split('@');
                v['phone'] = country[0] + v['phone'];
                this.setState({ submitting: true });
                func.post('maxids_requests/save', v).then(res => {
                    this.setState({ submitting: false });
                    if (res.status === 200) {
                        message.success('Your request has been submitted. You will hear from us within 48hours or less');
                        this.props.setNavigate('index');
                    } else {
                        message.error(res.result);
                    }
                });
            }
        });
    }
    _activate = (e) => {
        e.preventDefault();

    }

    render() {
        const { form: { getFieldDecorator }, row, utils: { allcountries } } = this.props;
        const { submitting } = this.state;

        return (
            <Form hideRequiredMark={false} onSubmit={this._submit}>
                <h3 className="tx-color-01 mg-b-5"><FormattedMessage id="Text.Verify" defaultMessage="Verify Your Account" /></h3>
                <p className="tx-color-03 tx-16 mg-b-40">It's free to signup and only takes a minute.</p>

                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-4">
                                <Form.Item colon={false} label={<FormattedMessage id="Label.MaxID" defaultMessage="Max ID" />}>
                                    {getFieldDecorator('username', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.maxid
                                    })(
                                        <Input autoComplete="off" size="large" readOnly={true} disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-8">
                                <Form.Item colon={false} label={<FormattedMessage id="Label.Name" defaultMessage="Name" />}>
                                    {getFieldDecorator('name', {
                                        rules: [{ required: true, message: <span /> }]
                                    })(
                                        <Input autoComplete="off" size="large" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12">
                                <Form.Item colon={false} label={<FormattedMessage id="Label.Email" defaultMessage="Email address" />}>
                                    {getFieldDecorator('email', {
                                        rules: [{ required: true, message: <span /> }]
                                    })(
                                        <Input autoComplete="off" size="large" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12">
                                <Form.Item colon={false} label={<FormattedMessage id="Label.CountryRes" defaultMessage="Country of residence" />}>
                                    {getFieldDecorator('country', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: this.state.country
                                    })(
                                        <Select size="large" showSearch={true} disabled={submitting} onChange={(e) => this.setState({ country: e })}>
                                            {allcountries.map(cnt => (
                                                <Select.Option key={cnt.iso} value={`${cnt.iso}@${cnt.code}@${cnt.name}`}>{cnt.name} ({cnt.code})</Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12">
                                <Form.Item colon={false} label={<FormattedMessage id="Label.Phone" defaultMessage="Phone Number" />}>
                                    {getFieldDecorator('phone', {
                                        rules: [{ required: true, message: <span /> }]
                                    })(
                                        <Input autoComplete="off" size="large" addonBefore={<span>{this.state.country.split('@')[1]}</span>} disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12">
                                <Button type="primary" htmlType="submit" block loading={submitting}>
                                    <FormattedMessage id="Button.Verify" defaultMessage="Verify" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        )
    }

}

const Verify = Form.create()(VerifyForm);
export default Verify;