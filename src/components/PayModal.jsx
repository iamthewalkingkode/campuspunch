import React, { useState, useEffect } from 'react';
import { Form, Modal, Input, Button } from 'antd';
import * as func from '../utils/functions';

const PayModalScreen = props => {
    const { amount, title, visible, type, payModeDefault, form: { getFieldDecorator, validateFields }, _auth: { logg, authenticated } } = props;
    const [submitting, setSubmitting] = useState(false);
    const [payMode, setPayMode] = useState(payModeDefault || '');
    const [interval, setIntervals] = useState(null);
    const [errMessage, setErrMessage] = useState('');
    const [sucMessage, setSucMessage] = useState('');
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        _status();
    });

    const _success = (reference, json_init, json_back, status) => {
        setSubmitting(true);
        func.post('payment/save', { user: logg.id, type, amount, reference, data: props.paySuccessData, json_init, json_back, status }).then((res) => {
            setSubmitting(false);
            if (res.status === 200) {
                _status();
                props.paySuccess(res);
            } else {

            }
        });
    }

    const _payStack = () => {
        // pk_live_dcaf413908c1d27a2dc2ea9e3c09609a39a99bc0
        // pk_test_dfa5385701ceb816ad272ce79e4f257b1d0cd805
        var payStack = window.PaystackPop.setup({
            key: ['of', 'qa'].includes(func.api.space) ? 'pk_test_dfa5385701ceb816ad272ce79e4f257b1d0cd805' : 'pk_live_dcaf413908c1d27a2dc2ea9e3c09609a39a99bc0',
            email: logg.email,
            amount: amount + '00',
            currency: 'NGN',
            ref: Math.floor((Math.random() * 1000000000) + 1),
            callback: function (pay) {
                if (pay.status === 'success') {
                    _success(pay.reference, {}, pay, 1);
                } else {
                    Modal.info({
                        title: 'Payment failed',
                        content: `The payment you just made failed.`,
                        // okText: 'Go back'
                    });
                }
            },
            onClose: function () {
                // alert('window closed');
            }
        });
        payStack.openIframe();
    }

    const _zoranga = (e) => {
        e.preventDefault();
        validateFields((err, v) => {
            if (!err) {
                setSubmitting(true);
                setErrMessage('');
                v['description'] = `Payment for CampusPunch Recharge of #${amount} by ${logg.username}`;
                func.post('payment/zoranga', v).then(res => {
                    setSubmitting(false);
                    if (res.status === 200) {
                        func.setStorage(`payToken.${payMode}.${type}.${amount}`, res.zoranga.reference);
                        _success(res.zoranga.reference, res.zoranga, {}, 0);
                    } else {
                        setErrMessage(res.result);
                    }
                });
            }
        });
    };

    const _status = () => {
        let reference = func.getStorage(`payToken.${payMode}.${type}.${amount}`);
        if (payMode === 'zoranga' && visible && reference && verifying === false) {
            setVerifying(true);
            setSucMessage('DO NOT CLOSE!! We are verifying your payment.');
            let interval = setInterval(() => {
                setIntervals(interval);
                func.post('payment/verify', { reference }).then(res => {
                    if (res.status === 200) {
                        // onOK(res);
                        setSucMessage('');
                        props.onCancel();
                        clearInterval(interval);
                        props.paySuccess(res);
                        func.delStorage(`payToken.${payMode}.${type}.${amount}`);
                    }
                });
            }, 5000);
        }
    }

    const _cancel = () => {
        clearInterval(interval);
        props.onCancel();
        setTimeout(() => {
            setPayMode('');
        }, 100);
    }

    return (
        <React.Fragment>
            <Modal visible={visible && authenticated} onCancel={props.onCancel} title={title} closable={submitting || verifying} footer={[
                <Button key="back" onClick={_cancel} disabled={verifying}>
                    Cancel
                </Button>
                ,
                payMode === 'zoranga' && (
                    <Button key="submit" type="primary" loading={submitting || verifying} onClick={_zoranga}>
                        Submit
                    </Button>
                ),
            ]}>
                {payMode === '' && (
                    <div>
                        <div className="pointer pd-12 mg-b-15" onClick={() => setPayMode('zoranga')} style={{ background: '#e5e9f2' }}>
                            <i className="fa fa-phone text-muted"></i> &nbsp; Pay with recharge cards
                        </div>
                        <div className="pointer pd-12 mg-b-15" onClick={() => { _payStack(); _cancel() }} style={{ background: '#e5e9f2' }}>
                            <i className="fa fa-credit-card text-muted"></i> &nbsp; Pay with bank card
                        </div>
                    </div>
                )}

                {payMode === 'zoranga' && (
                    <Form hideRequiredMark={false} className={errMessage ? 'animated shake' : ''}>
                        {errMessage && (<div className="alert alert-danger">{errMessage}</div>)}
                        {sucMessage && (<div className="alert alert-success">{sucMessage}</div>)}
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
                        <Form.Item colon={false} label="Recharge card PINs">
                            {getFieldDecorator('airtime', {
                                rules: [{ required: true }]
                            })(
                                <Input autoComplete="off" size="large" disabled={submitting || sucMessage} />
                            )}
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </React.Fragment>
    );
};

const PayModal = Form.create()(PayModalScreen);
export default PayModal;