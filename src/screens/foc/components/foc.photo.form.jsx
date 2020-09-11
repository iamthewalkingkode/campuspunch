import React, { useState, useEffect } from 'react';
import { Button, message, Form, Modal, Input } from 'antd';
import * as func from '../../../utils/functions';

const FocPhotoForm = props => {
    const contest = parseInt(props.match.params.contest.split('.')[1]);
    const { visible, row, _auth: { logg }, form: { getFieldDecorator, validateFields, resetFields } } = props;
    const [submitting, setSubmitting] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (row.id) {
            setImages(row.images_links);
        }
    }, [row]);

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
        if (image.match(/http/)) {
            // http://localhost/campuspunch/api/v1/
            const nImages = (images.filter(img => (img !== image && img.match(/http/)))).map(img => {
                return img.split(func.api.apiURL + 'assets/user/')[1];
            });
            func.post('users/update', { id: row.id, images: nImages.join(',') }).then(res => {
                setSubmitting(false);
                if (res.status === 200) {
                    props.onSuccess(res.user);
                } else {
                    message.error(res.result);
                }
            });
        }
        setImages(images.filter(img => img !== image));
    }

    const _submit = (e) => {
        e.preventDefault();
        if (files.length >= 3 || row.id) {
            validateFields((err, v) => {
                if (!err) {
                    setSubmitting(true);
                    setErrMessage('');
                    if (files.length > 0) {
                        var payload = { folder: 'user', filename: logg.username };
                        window.$.each(files, (f) => {
                            payload['file[' + f + ']'] = files[f];
                        });
                        func.postFile('upload', payload).then(upl => {
                            setSubmitting(false);
                            if (upl.status === 200) {
                                _submitGo(v, upl.result);
                            } else {
                                setErrMessage(upl.result);
                            }
                        });
                    } else {
                        _submitGo(v, '');
                    }
                }
            });
        } else {
            setErrMessage('You must attach at least three photos');
        }
    }

    const _submitGo = (v, images) => {
        v['user'] = logg.id;
        v['school'] = logg.school.id;
        v['contest'] = contest;
        v['images'] = images;
        func.post(`foc/photo_${row.id ? 'update' : 'apply'}`, v).then(res => {
            setSubmitting(false);
            if (res.status === 200) {
                setFiles([]);
                resetFields();
                setImages([]);
                props.onCancel();
                if (row.id) {
                    props.onSuccess(res.user);
                    message.success('Your profile has been updated');
                } else {
                    props.history.push(`/face-of-campus/photo/${props.match.params.contest}/apply`);
                    message.success('Your application has been received');
                }
            } else {
                setErrMessage(res.result);
            }
        });
    }

    return (
        <Modal visible={visible} title="Submit your profile" width={700} closable={true} maskClosable={false} destroyOnClose={true} onCancel={() => { setImages([]); setFiles([]); props.onCancel(); }}
            footer={[
                <Button key="submit" type="primary" loading={submitting} onClick={_submit}>Submit</Button>
            ]}
            className={errMessage ? 'animated shake' : ''}
        >
            {errMessage && (
                <div className="alert alert-danger text-center">{errMessage}</div>
            )}
            {/* <div className="alert alert-info text-center">
                Kindly submit your own photos not someone else' to avoid ban. <br /> <b>Once you submit you have successfully applied for this contest.</b>
            </div> */}
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
                <label className="custom-file-label" for="customFile">Add Photos (at least three)</label>
            </div>
            <div className="rows row-sms bg-gray-100 pd-10">
                {images.map(image => (
                    <div className="col-12s col-lg-3 float-left mg-r-10 mg-t-5">
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


export default Form.create()(FocPhotoForm);