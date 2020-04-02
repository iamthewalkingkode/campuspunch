import React, { Component } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import * as func from '../../utils/functions';

import { Loading } from '../../components';

const defaultImg = 'assets/img/noimage.jpg';

class PostFormScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            row: { user: {}, schools: [[]], category: {} },
            loading: false, submitting: false,
            screen: '', id: 0,
            file: null, image: defaultImg, action: 'insert'
        };
    }

    componentDidMount() {
        this.props.setMetaTags({
            title: 'Post new article', description: 'Post campus related news, stories, events, gossips, and experiences. Original contents earns extra 200 coins and above.', keywords: ''
        });
        this.props.setHeaderTitle({ h1: 'Post new article', h3: '', p: '', image: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.summernote();
    }

    summernote = () => {
        setTimeout(() => {
            window.$('.summernote').summernote({
                height: 250,
                toolbar: [
                    ['headline', ['style']],
                    ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
                    ['textsize', ['fontsize']],
                    ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
                ]
            });
        }, 0);
    }

    formChange = (e) => {
        var self = this;
        var target = e.target.files[0];
        var imageInput = document.getElementById('image');
        var image = imageInput.files[0];
        var reader = new FileReader();
        reader.onload = function (r) {
            self.setState({ file: target, image: reader.result });
        }
        reader.readAsDataURL(image);
    }

    _submit(e) {
        e.preventDefault();
        const { file } = this.state;
        const { form: { validateFields } } = this.props;
        validateFields((err, v) => {
            if (!err) {
                this.setState({ submitting: true });
                if (file) {
                    func.postFile('upload', { 'Authorization': func.api.apiKey + '.' + func.api.apiToken, folder: 'posts', 'file[0]': file, filename: v.title }).then(res => {
                        if (res.status === 200) {
                            this._submitGo(v, res.result);
                        } else {
                            this.setState({ submitting: false });
                            message.error(res.result);
                        }
                    });
                } else {
                    this._submitGo(v);
                }
            }
        });
    }
    _submitGo(v, image) {
        const { auth: { logg }, form: { resetFields } } = this.props;
        v['user'] = logg.id;
        v['image'] = image;
        v['content'] = window.$('#content').val();
        func.post(`posts/${this.state.action}`, v).then(res => {
            this.setState({ submitting: false });
            if (res.status === 200) {
                resetFields();
                message.success('Your article has been posted');
            } else {
                message.error(res.result);
            }
        });
    }

    render() {
        const { loading, submitting, image } = this.state;
        const { data: { newsCategories, schools }, form: { getFieldDecorator }, auth: { logg } } = this.props;

        return (
            <React.Fragment>
                {loading === true && (<Loading text={`loading article...`} />)}

                {loading === false && (
                    <div className="mg-b-30">
                        <div>
                            <div className="text-center mg-b-10s">
                                <h2>Post campus related news, stories, events, gossips, and experiences</h2>
                                <p>(Original contents earns extra 200 coins and above)</p>
                                <p classname="text-muted">Kindly Post an article Here. (This will be shown after moderation by Our Admin)</p>
                            </div>
                            <hr />

                            <Form hideRequiredMark={false} onSubmit={e => this._submit(e)}>
                                <div className="row">
                                    <div className="col-12 col-sm-3 col-lg-3">
                                        <div className="img-thumbnail"><img src={image} className="roundeds" alt="Default" style={{ width: '100%' }} /></div>
                                        <input type="file" name="image" id="image" accept="image/*" onChange={this.formChange} className="hide" />
                                        <button type="button" className="btn btn-xs btn-block btn-secondary mb-1" onClick={() => window.$('#image').click()}>Choose a picture</button>
                                    </div>
                                    <div className="col-12 col-sm-9 col-lg-9">
                                        <div className="row">
                                            <div className="col-12">
                                                <Form.Item colon={false} label="Post title">
                                                    {getFieldDecorator('title', {
                                                        rules: [{ required: true }]
                                                    })(
                                                        <Input autoComplete="off" size="large" disabled={submitting} />
                                                    )}
                                                </Form.Item>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6">
                                                <Form.Item colon={false} label="Post category">
                                                    {getFieldDecorator('category', {
                                                        rules: [{ required: true }]
                                                    })(
                                                        <Select autoComplete="off" size="large" optionFilterProp="children" disabled={submitting}>
                                                            {newsCategories.map(ctg => (
                                                                <Select.Option key={ctg.id} value={ctg.id}>{ctg.name}</Select.Option>
                                                            ))}
                                                        </Select>
                                                    )}
                                                </Form.Item>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6">
                                                <Form.Item colon={false} label="School/Campus">
                                                    {getFieldDecorator('school', {
                                                        rules: [{ required: true }],
                                                        initialValue: logg.school.id
                                                    })(
                                                        <Select showSearch={true} autoComplete="off" size="large" disabled={submitting} optionFilterProp="children">
                                                            {schools.map(sch => (
                                                                <Select.Option key={sch.id} value={sch.id}>{sch.name}</Select.Option>
                                                            ))}
                                                        </Select>
                                                    )}
                                                </Form.Item>
                                            </div>
                                            <div className="col-12">
                                                <textarea id="content" className="summernote"></textarea>
                                            </div>
                                            <div className="col-12">
                                                <div>&nbsp;</div>
                                                <Button type="primary" htmlType="submit" loading={submitting}>Submit</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                )}
            </React.Fragment>
        )
    }

}

const PostForm = Form.create()(PostFormScreen);
export default PostForm;