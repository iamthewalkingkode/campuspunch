import React, { useState } from 'react';
import { Button, message, Form, Modal, Input } from 'antd';
import * as func from '../../../utils/functions';

const FocPhotoFormScreen = props => {
    const contest = parseInt(props.match.params.contest.split('.')[1]);
    const { visible, row, _auth: { logg }, form: { getFieldDecorator, validateFields, resetFields } } = props;
    const [submitting, setSubmitting] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [images, setImages] = useState([]);

    const addImage = async (e) => {
        window.$.each(e.target.files, (x) => {
            let target = e.target.files[x];
            let imageInput = document.getElementById('photos');
            let image = imageInput.files[x];
            let reader = new FileReader();
            reader.onloadend = () => {
                const nFiles = files.concat(target);
                const nImages = images.concat(reader.result);
                setFiles(nFiles);
                setImages(nImages);
            };
            reader.readAsDataURL(image);
        });
    }

    const removeImg = (image) => {
        setImages(images.filter(img => img !== image));
    }

    const _submit = (e) => {
        e.preventDefault();
        if (files.length >= 3) {
            validateFields((err, v) => {
                if (!err) {
                    setSubmitting(true);
                    setErrMessage('');
                    var payload = { folder: 'user', filename: logg.username };
                    window.$.each(files, (f) => {
                        payload['file[' + f + ']'] = files[f];
                    });
                    func.postFile('upload', payload).then(upl => {
                        setSubmitting(false);
                        if (upl.status === 200) {
                            v['user'] = logg.id;
                            v['school'] = logg.school.id;
                            v['contest'] = contest;
                            v['images'] = upl.result;
                            func.post(`foc/photo_apply`, v).then(res => {
                                setSubmitting(false);
                                if (res.status === 200) {
                                    resetFields();
                                    setImages([]);
                                    props.onCancel();
                                    if (!row.id) {
                                        props.history.push(`/face-of-campus/photo/${props.match.params.contest}/apply`);
                                        message.success('You application has been received');
                                    }
                                } else {
                                    setErrMessage(res.result);
                                }
                            });
                        } else {
                            setErrMessage(upl.result);
                        }
                    });
                }
            });
        } else {
            setErrMessage('You must attach at least three photos');
        }
    }

    return (
        <Modal visible={visible} title="Submit your profile" width={700} closable={true} maskClosable={false} destroyOnClose={true} onCancel={() => { setImages([]); props.onCancel(); }}
            footer={[
                <Button key="submit" type="primary" loading={submitting} onClick={_submit}>Submit</Button>
            ]}
            className={errMessage ? 'animated shake' : ''}
        >
            {errMessage && (
                <div className="alert alert-danger text-center">{errMessage}</div>
            )}
            <div className="row row-xs">
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
                <div className="col-12">
                    <Form.Item colon={false} label="About">
                        {getFieldDecorator('about', {
                            rules: [{ required: true }],
                            initialValue: logg.about
                        })(
                            <Input.TextArea rows={5} autoComplete="off" size="large" maxLength={300} disabled={submitting} />
                        )}
                    </Form.Item>
                </div>
                <div className="col-12">
                    <Form.Item colon={false} label="Personal quote">
                        {getFieldDecorator('quote', {
                            rules: [{ required: true }],
                            initialValue: logg.quote
                        })(
                            <Input.TextArea rows={4} autoComplete="off" size="large" maxLength={300} disabled={submitting} />
                        )}
                    </Form.Item>
                </div>
            </div>

            <div className="col-12 custom-file mg-t-20">
                <input type="file" id="photos" name="photos" accept="image/*" onChange={addImage} className="custom-file-input" />
                <label className="custom-file-label" for="customFile">Choose photos (at least three)</label>
            </div>
            <div className="rows row-sms bg-gray-100 pd-10">
                {images.map(image => (
                    <div className="col-12s col-lg-3s float-left mg-r-10 mg-t-5">
                        <img src={image} alt={logg.username} className="img-thumbnail float-left" style={{ height: 115 }} />
                        <div className="badge badge-danger pointer wd-60p float-left" onClick={() => removeImg(image)}>Remove</div>
                        <div className="clearfix"></div>
                    </div>
                ))}
                <div className="clearfix"></div>
            </div>
        </Modal>
    );

};


const FocPhotoForm = Form.create()(FocPhotoFormScreen);
export default FocPhotoForm;