import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import * as func from '../../utils/functions';

const SetProfile = props => {
    const { form: { getFieldDecorator }, auth: { logg } } = props;
    const [submitting, setSubmitting] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        const { form: { validateFields }, auth: { token, logg } } = props;
        validateFields((err, v) => {
            if (!err) {
                setSubmitting(true);
                v['id'] = logg.id;
                func.post('users/update', v).then(res => {
                    setSubmitting(false);
                    if (res.status === 200) {
                        props.signInSuccess(token, res.data);
                        message.success('Social channels updated');
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
                    <Form hideRequiredMark={false} onSubmit={submit}>
                        <Form.Item colon={false} label="Whatsapp number">
                            {getFieldDecorator('whatsapp', {
                                initialValue: logg.whatsapp
                            })(
                                <Input autoComplete="off" size="large" addonBefore="https://wa.me/234" disabled={submitting} />
                            )}
                        </Form.Item>
                        <Form.Item colon={false} label="Twitter username">
                            {getFieldDecorator('twitter', {
                                initialValue: logg.twitter
                            })(
                                <Input autoComplete="off" size="large" addonBefore="https://twitter.com/" disabled={submitting} />
                            )}
                        </Form.Item>
                        <Form.Item colon={false} label="Facebook username">
                            {getFieldDecorator('facebook', {
                                initialValue: logg.facebook
                            })(
                                <Input autoComplete="off" size="large" addonBefore="https://facebook.com/" disabled={submitting} />
                            )}
                        </Form.Item>
                        <Form.Item colon={false} label="LinkedIn">
                            {getFieldDecorator('linkedin', {
                                initialValue: logg.linkedin
                            })(
                                <Input autoComplete="off" size="large" addonBefore="https://linkedin.com/in/" disabled={submitting} />
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

const SettingsProfile = Form.create()(SetProfile);
export default SettingsProfile;