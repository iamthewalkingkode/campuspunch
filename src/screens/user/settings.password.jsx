import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import * as func from '../../utils/functions';

const SetPassword = props => {
    const { form: { getFieldDecorator } } = props;
    const [submitting, setSubmitting] = useState(false);

    const confirmPassword = (rule, value, callback) => {
        if (!value) {
            callback();
        }
        if (value !== props.form.getFieldValue('npassword')) {
            callback('Passwords do not match');
        }
        callback();
    };

    const submit = (e) => {
        e.preventDefault();
        const { form: { validateFields, resetFields }, auth: { logg } } = props;
        validateFields((err, v) => {
            if (!err) {
                setSubmitting(true);
                v['id'] = logg.id;
                func.post('users/password', v).then(res => {
                    setSubmitting(false);
                    if (res.status === 200) {
                        resetFields();
                        message.success('Passwords changed');
                    } else {
                        message.error(res.result);
                    }
                });
            }
        });
    }

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12 col-lg-3"></div>
                <div className="col-12 col-lg-6">
                    <div class="alert alert-info mg-b-25" role="alert">It's a good idea to use a strong password that you're not using elsewhere</div>
                    <Form hideRequiredMark={false} onSubmit={submit}>
                        <Form.Item colon={false} label="Current password">
                            {getFieldDecorator('password', {
                                rules: [{ required: true }]
                            })(
                                <Input.Password autoComplete="off" size="large" disabled={submitting} />
                            )}
                        </Form.Item>
                        <Form.Item colon={false} label="New password">
                            {getFieldDecorator('npassword', {
                                rules: [{ required: true }]
                            })(
                                <Input.Password autoComplete="off" size="large" disabled={submitting} />
                            )}
                        </Form.Item>
                        <Form.Item colon={false} label="Confirm password">
                            {getFieldDecorator('cpassword', {
                                rules: [{ required: true }, { validator: confirmPassword }]
                            })(
                                <Input.Password autoComplete="off" size="large" disabled={submitting} />
                            )}
                        </Form.Item>

                        <Button type="primary" htmlType="submit" loading={submitting}>Save changes</Button>
                    </Form>
                </div>
                <div className="col-12 col-lg-3"></div>
            </div>
        </React.Fragment>
    );
};

const SettingsPassword = Form.create()(SetPassword);
export default SettingsPassword;