import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import * as func from '../../utils/functions';

const SetProfile = props => {
    const { form: { getFieldDecorator }, _auth: { logg } } = props;
    const [submitting, setSubmitting] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        const { form: { validateFields }, _auth: { logg } } = props;
        validateFields((err, v) => {
            if (!err) {
                setSubmitting(true);
                v['id'] = logg.id;
                func.post('users/update', v).then(res => {
                    setSubmitting(false);
                    if (res.status === 200) {
                        props.signInSuccess(res.user);
                        message.success('FOC details updated');
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
                        <Form.Item colon={false} label="Height">
                            {getFieldDecorator('height', {
                                initialValue: logg.height
                            })(
                                <Input autoComplete="off" size="large" disabled={submitting} />
                            )}
                        </Form.Item>
                        <Form.Item colon={false} label="Bust">
                            {getFieldDecorator('bust', {
                                initialValue: logg.bust
                            })(
                                <Input autoComplete="off" size="large" disabled={submitting} />
                            )}
                        </Form.Item>
                        <Form.Item colon={false} label="Waist">
                            {getFieldDecorator('waist', {
                                initialValue: logg.waist
                            })(
                                <Input autoComplete="off" size="large" disabled={submitting} />
                            )}
                        </Form.Item>
                        <Form.Item colon={false} label="Hips">
                            {getFieldDecorator('hips', {
                                initialValue: logg.hips
                            })(
                                <Input autoComplete="off" size="large" disabled={submitting} />
                            )}
                        </Form.Item>
                        <Form.Item colon={false} label="Shoe size">
                            {getFieldDecorator('shoe_size', {
                                initialValue: logg.shoe_size
                            })(
                                <Input autoComplete="off" size="large" disabled={submitting} />
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