import React, { useState } from 'react';
import { Button, message, Form, Input, Modal, Select } from 'antd';
import * as func from '../../../utils/functions';

const FocMusicFormScreen = props => {
    const { visible, contest, row, data: { musicGenres }, _auth: { logg }, form: { getFieldDecorator, validateFields, resetFields } } = props;
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
                func.post(`foc/music_apply`, v).then(res => {
                    setSubmitting(false);
                    if (res.status === 200) {
                        resetFields();
                        props.onCancel();
                        if(!row.id) {
                            props.history.push(`/face-of-campus/music/${props.match.params.contest}/apply`);
                            message.success('You application has been received');
                        }
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
            <Form.Item colon={false} label="Music" help="SoundCloud embed code">
                {getFieldDecorator('song', {
                    rules: [{ required: true }],
                    initialValue: row.song
                })(
                    <Input.TextArea rows={6} autoComplete="off" size="large" placeholder={`<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/312399740&color=%2394948c&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>`} disabled={submitting} />
                )}
            </Form.Item>
            <Form.Item colon={false} label="Music video" help="Link to from youtube video">
                {getFieldDecorator('video', {
                    initialValue: row.video
                })(
                    <Input autoComplete="off" size="large" placeholder="https://www.youtube.com/watch?v=KGHAbXYR8Eo" disabled={submitting} />
                )}
            </Form.Item>
            <Form.Item colon={false} label="Music category">
                {getFieldDecorator('category', {
                    rules: [{ required: true }],
                    initialValue: row.category
                })(
                    <Select size="large" showSearch={true} optionFilterProp="children" disabled={submitting}>
                        {musicGenres.map(genre => (
                            <Select.Option key={genre} value={genre}>{genre}</Select.Option>
                        ))}
                    </Select>
                )}
            </Form.Item>

            {/* <iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/312399740&color=%2394948c&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe> */}

            {/* <iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/312399740&color=%2394948c&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe> */}
        </Modal>
    );

};


const FocMusicForm = Form.create()(FocMusicFormScreen);
export default FocMusicForm;