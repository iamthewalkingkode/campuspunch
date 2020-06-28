import React, { useState } from 'react';
import { Form, Modal, Input, Button } from 'antd';
import * as func from '../utils/functions';

const PartnerForm = props => {
    const { visible, form: { getFieldDecorator, validateFields } } = props;
    const [submitting, setSubmitting] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const _submit = e => {
        e.preventDefault();
        validateFields((err, v) => {
            if (!err) {
                let body = '';
                body += `<p><b>Full name</b>: ${v.name}</p>`;
                body += `<p><b>Phone number</b>: ${v.phone}</p>`;
                body += `<p><b>Email address</b>: ${v.email}</p>`;
                body += `<p><b>Business name</b>: ${v.business_name}</p>`;
                body += `<p><b>Business address</b>: ${v.business_address}</p>`;
                body += `<p><b>Reason</b>: ${v.reason}</p>`;
                setSubmitting(true);
                func.post('sendmail', { to: 'CampusPunchng@gmail.com', from: v.email, fromName: v.name, subject: 'Partnership Request', base64: btoa(body) }).then(res => {
                    setSubmitting(false);
                    if (res.status === 200) {
                        setSuccess(true);
                    } else {
                        setErrMessage(res.result);
                    }
                });
            }
        });
    }

    const _cancel = () => {
        setSuccess(false);
        setErrMessage('');
        props.onCancel();
    }

    return (
        <React.Fragment>
            <Modal visible={visible} onCancel={_cancel} title="Contact us" destroyOnClose={true} footer={[
                <Button key="back" onClick={_cancel} disabled={submitting}>
                    Cancel
                </Button>
                ,
                success === false && (
                    <Button key="submit" type="primary" loading={submitting} onClick={_submit}>
                        Submit
                    </Button>
                )
            ]}>
                {success === true && (
                    <div className="text-center">
                        <div><b>THANKS FOR YOUR INTEREST IN US</b></div>
                        <p>Kindly reach out to us through our contacts:</p>
                        <p><a href="https://fb.com/FaceOfCampus" target="_blank" rel="noopener noreferrer">FaceBook</a></p>
                        <p><a href="https://instagram.com/FaceOfCampus_" target="_blank" rel="noopener noreferrer">InstaGram</a></p>
                        <p><a href="https://mobile.twitter.com/Campus_Punch" target="_blank" rel="noopener noreferrer">Twitter</a></p>
                        <p><a href="https://wa.me/2348100369606" target="_blank" rel="noopener noreferrer">WhatsApp</a></p>
                        <p><a href="mailto:CampusPunchng@gmail.com">CampusPunchng@gmail.com</a></p>
                        <p><a href="tel:+234810039606">+234 810 039 606</a></p>
                    </div>
                )}
                {success === false && (
                    <Form hideRequiredMark={false} className={errMessage ? 'animated shake' : ''}>
                        {errMessage && (<div className="alert alert-danger">{errMessage}</div>)}
                        <Form.Item colon={false} label="Full name">
                            {getFieldDecorator('name', {
                                rules: [{ required: true }]
                            })(
                                <Input autoComplete="off" size="large" disabled={submitting} />
                            )}
                        </Form.Item>
                        <Form.Item colon={false} label="Phone number">
                            {getFieldDecorator('phone', {
                                rules: [{ required: true }]
                            })(
                                <Input addonBefore="+234" maxLength={11} autoComplete="off" size="large" disabled={submitting} />
                            )}
                        </Form.Item>
                        <Form.Item colon={false} label="Email address">
                            {getFieldDecorator('email', {
                                rules: [{ required: true }]
                            })(
                                <Input autoComplete="off" size="large" disabled={submitting} />
                            )}
                        </Form.Item>
                        <Form.Item colon={false} label="Business name">
                            {getFieldDecorator('business_name', {
                                rules: [{ required: true }]
                            })(
                                <Input autoComplete="off" size="large" disabled={submitting} />
                            )}
                        </Form.Item>
                        <Form.Item colon={false} label="Business address">
                            {getFieldDecorator('business_address', {
                                rules: [{ required: true }]
                            })(
                                <Input autoComplete="off" size="large" disabled={submitting} />
                            )}
                        </Form.Item>
                        <Form.Item colon={false} label="Why do you want to reach out to us? Give details">
                            {getFieldDecorator('reason', {
                                rules: [{ required: true }]
                            })(
                                <Input.TextArea rows={4} autoComplete="off" size="large" disabled={submitting} />
                            )}
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </React.Fragment>
    );
};


export default Form.create()(PartnerForm);