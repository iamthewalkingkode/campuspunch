import React, { useState } from 'react';
import { Button, message, Form, Input, Modal } from 'antd';
import * as func from '../../../utils/functions';

const FocVideoFormScreen = props => {
    const { visible, contest, row, _auth: { logg }, form: { getFieldDecorator, validateFields, resetFields } } = props;
    const [submitting, setSubmitting] = useState(false);
    const [errMessage, setErrMessage] = useState('');

    const _submit = (e) => {
        e.preventDefault();
        validateFields((err, v) => {
            if (!err) {
                setSubmitting(true);
                setErrMessage('');
                v['user'] = logg.id;
                v['school'] = logg.school.id;
                v['contest'] = contest;
                func.post(`foc/video_apply`, v).then(res => {
                    setSubmitting(false);
                    if (res.status === 200) {
                        resetFields();
                        props.onCancel();
                        props.history.push(`/face-of-campus/music/${props.match.params.contest}/apply`);
                        message.success('You application has been received');
                    } else {
                        setErrMessage(res.result);
                    }
                });
            }
        });
    }

    return (
        <Modal visible={visible} title="Submit Music" width={600} closable={true} maskClosable={false} onCancel={props.onCancel}
            footer={[
                <Button key="submit" type="primary" onClick={_submit}>Submit</Button>
            ]}
            className={errMessage ? 'animated shake' : ''}
        >
            {errMessage && (
                <div className="alert alert-danger text-center">{errMessage}</div>
            )}
            <Form.Item colon={false} label="Music title">
                {getFieldDecorator('title', {
                    rules: [{ required: true }],
                    initialValue: row.title
                })(
                    <Input autoComplete="off" size="large" disabled={submitting} />
                )}
            </Form.Item>
            <Form.Item colon={false} label="Description">
                {getFieldDecorator('description', {
                    rules: [{ required: true }],
                    initialValue: row.description
                })(
                    <Input.TextArea rows={6} autoComplete="off" size="large" disabled={submitting} />
                )}
            </Form.Item>
            <Form.Item colon={false} label="Music video" help="Link to from youtube video">
                {getFieldDecorator('video', {
                    initialValue: row.video
                })(
                    <Input autoComplete="off" size="large" placeholder="https://www.youtube.com/watch?v=KGHAbXYR8Eo" disabled={submitting} />
                )}
            </Form.Item>
        </Modal>
    );

};


const FocVideoForm = Form.create()(FocVideoFormScreen);
export default FocVideoForm;