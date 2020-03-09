import React, { useState } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import * as func from '../../utils/functions';

const SetProfile = props => {
    const { form: { getFieldDecorator }, utils: { states, schools, studentCategories }, auth: { logg } } = props;
    const [image, setImage] = useState(undefined);
    const [avatar, setAvatar] = useState(logg.avatar_link);
    const [submitting, setSubmitting] = useState(false);

    const formChange = (e) => {
        var target = e.target.files[0];
        var imageInput = document.getElementById('image');
        var image = imageInput.files[0];
        var reader = new FileReader();
        reader.onload = function (r) {
            setImage(target);
            setAvatar(reader.result);
        }
        reader.readAsDataURL(image);
    }

    const submit = (e) => {
        e.preventDefault();
        const { form: { validateFields }, auth: { logg } } = props;
        validateFields((err, v) => {
            if (!err) {
                setSubmitting(true);
                if (image) {
                    func.postFile('upload', { 'Authorization': func.api.apiKey + '.' + func.api.apiToken, folder: 'user', 'file[0]': image, filename: logg.username }).then(res => {
                        if (res.status === 200) {
                            submitGo(v, res.result);
                        } else {
                            setSubmitting(false);
                            message.error(res.result);
                        }
                    });
                } else {
                    submitGo(v);
                }
            }
        });
    }
    const submitGo = (v, avatar) => {
        const { auth: { token, logg } } = props;
        v['id'] = logg.id;
        v['phone'] = '+234' + v['phone'];
        if (avatar) {
            v['avatar'] = avatar;
            v['oldavatar'] = logg.avatar;
        }
        func.post('users/update', v).then(res => {
            setSubmitting(false);
            if (res.status === 200) {
                props.signInSuccess(token, res.user);
                message.success('Profile details updated');
            } else {
                message.error(res.result);
            }
        });
    }

    return (
        <React.Fragment>
            <Form hideRequiredMark={false} onSubmit={submit}>
                <div className="row">
                    <div className="col-12 col-lg-9">
                        <div className="row">
                            <div className="col-6 col-lg-6">
                                <Form.Item colon={false} label="First name">
                                    {getFieldDecorator('firstname', {
                                        rules: [{ required: true }],
                                        initialValue: logg.firstname
                                    })(
                                        <Input autoComplete="off" size="large" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-6 col-lg-6">
                                <Form.Item colon={false} label="Last name">
                                    {getFieldDecorator('lastname', {
                                        rules: [{ required: true }],
                                        initialValue: logg.lastname
                                    })(
                                        <Input autoComplete="off" size="large" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-6 col-lg-6">
                                <Form.Item colon={false} label="Email address">
                                    {getFieldDecorator('email', {
                                        rules: [{ required: true }, { type: 'email' }],
                                        initialValue: logg.email
                                    })(
                                        <Input autoComplete="off" size="large" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-6 col-lg-6">
                                <Form.Item colon={false} label="Phone number">
                                    {getFieldDecorator('phone', {
                                        rules: [{ required: true }],
                                        initialValue: logg.phone.split('+234').join('')
                                    })(
                                        <Input autoComplete="off" size="large" addonBefore="+234" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-6 col-lg-6">
                                <Form.Item colon={false} label="State of residence">
                                    {getFieldDecorator('state', {
                                        rules: [{ required: true }],
                                        initialValue: logg.state || undefined
                                    })(
                                        <Select showSearch={true} autoComplete="off" size="large" disabled={submitting}>
                                            {states.map(state => (
                                                <Select.Option key={state} value={state}>{state}</Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-6 col-lg-6">
                                <Form.Item colon={false} label="School/Campus">
                                    {getFieldDecorator('school', {
                                        rules: [{ required: true }],
                                        initialValue: logg.school.id || undefined
                                    })(
                                        <Select showSearch={true} autoComplete="off" size="large" disabled={submitting}>
                                            {schools.map(sch => (
                                                <Select.Option key={sch.id} value={sch.id}>{sch.name}</Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-6 col-lg-6">
                                <Form.Item colon={false} label="Category">
                                    {getFieldDecorator('category', {
                                        rules: [{ required: true }],
                                        initialValue: logg.category
                                    })(
                                        <Select autoComplete="off" size="large" disabled={submitting}>
                                            {studentCategories.map(category => (
                                                <Select.Option key={category} value={category}>{category}</Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12">
                                <Form.Item colon={false} label="About">
                                    {getFieldDecorator('about', {
                                        initialValue: logg.about
                                    })(
                                        <Input.TextArea rows={5} autoComplete="off" size="large" maxLength={300} disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12">
                                <Form.Item colon={false} label="Personal quote">
                                    {getFieldDecorator('quote', {
                                        initialValue: logg.quote
                                    })(
                                        <Input.TextArea rows={4} autoComplete="off" size="large" maxLength={300} disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12">
                                <Button type="primary" htmlType="submit" loading={submitting}>Save changes</Button>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-3">
                        <div class="img-thumbnail"><img src={avatar} class="rounded" alt={logg.username} style={{ width: '100%' }} /></div>
                        <input type="file" name="image" id="image" accept="image/*" onChange={formChange} className="hide" />
                        <button type="button" className="btn btn-xs btn-block btn-secondary mb-1" onClick={() => window.$('#image').click()}>Change picture</button>
                    </div>
                </div>
            </Form>
        </React.Fragment>
    );
};

const SettingsProfile = Form.create()(SetProfile);
export default SettingsProfile;