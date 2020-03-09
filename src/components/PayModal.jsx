import React, { useState, useEffect } from 'react';
import { Form, Modal, Input, Button } from 'antd';
import * as func from '../utils/functions';

const PayModalScreen = props => {
    const { amount, title, visible, type, form: { getFieldDecorator, validateFields }, auth: { token } } = props;
    const [submitting, setSubmitting] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [sucMessage, setSucMessage] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [interval, setIntervals] = useState(null);

    useEffect(() => {
        _status();
    });

    const _submit = (e) => {
        e.preventDefault();
        validateFields((err, v) => {
            if (!err) {
                setSubmitting(true);
                setErrMessage('');
                v['type'] = type;
                func.post('recharge', v).then(res => {
                    setSubmitting(false);
                    if (res.status === 200) {
                        func.setStorage(`payToken.${type}.${amount}`, res.zoranga.reference);
                        _status();
                    } else {
                        setErrMessage(res.result);
                    }
                });
            }
        });
    };

    const _status = () => {
        let reference = func.getStorage(`payToken.${type}.${amount}`);
        if (visible && reference && verifying === false) {
            setVerifying(true);
            setSucMessage('DO NOT CLOSE!! We are verifying your payment.');
            let interval = setInterval(() => {
                setIntervals(interval);
                func.post('recharge/verify', { reference }).then(res => {
                    if (res.status === 200) {
                        // onOK(res);
                        setSucMessage('');
                        props.onCancel();
                        clearInterval(interval);
                        props.signInSuccess(token, res.user);
                        func.delStorage(`payToken.${type}.${amount}`)
                    }
                });
            }, 5000);
        }
    }

    const _cancel = () => {
        clearInterval(interval);
        props.onCancel();
    }

    return (
        <React.Fragment>
            <Modal visible={visible} onCancel={props.onCancel} title={title} closable={submitting || verifying} footer={[
                <Button key="back" onClick={_cancel} disabled={verifying}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" loading={submitting || verifying} onClick={_submit}>
                    Submit
                </Button>,
            ]}>
                <Form hideRequiredMark={false} className={errMessage ? 'animated shake' : ''} onSubmit={_submit}>
                    {errMessage && (<div class="alert alert-danger">{errMessage}</div>)}
                    {sucMessage && (<div class="alert alert-success">{sucMessage}</div>)}
                    <Form.Item colon={false} label="Amount">
                        {getFieldDecorator('amount', {
                            rules: [{ required: true }],
                            initialValue: amount
                        })(
                            <Input autoComplete="off" size="large" disabled={true} />
                        )}
                    </Form.Item>
                    <Form.Item colon={false} label="Phone number">
                        {getFieldDecorator('phone', {
                            rules: [{ required: true }],
                            initialValue: ''
                        })(
                            <Input autoComplete="off" size="large" disabled={submitting || sucMessage} />
                        )}
                    </Form.Item>
                    <Form.Item colon={false} label="Recharge card PIN">
                        {getFieldDecorator('airtime', {
                            rules: [{ required: true }]
                        })(
                            <Input autoComplete="off" size="large" disabled={submitting || sucMessage} />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </React.Fragment>
    );
};

const PayModal = Form.create()(PayModalScreen);
export default PayModal;