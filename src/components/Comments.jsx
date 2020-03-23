import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Comment, Avatar } from 'antd';
import * as func from '../utils/functions';
import { Link } from 'react-router-dom';

const CommentsC = props => {
    const { type, item, auth: { logg, authenticated }, form: { getFieldDecorator, getFieldValue, validateFields, resetFields } } = props;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [comments, setComments] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getComments();
    });

    const getComments = () => {
        if (loading === false && fetching === true) {
            setLoading(true);
            setFetching(false);
            func.post('comments', { item, type, limit: 12 }).then(res => {
                setLoading(false);
                if (res.status === 200) {
                    setComments(res.result);
                }
            });
        }
    }

    const postComment = (e) => {
        e.preventDefault();
        validateFields((err, v) => {
            if (!err) {
                setErrorMessage('');
                setSubmitting(true);
                func.post('comments/insert', { item, type, user: logg.id, content: v.content }).then(res => {
                    setSubmitting(false);
                    if (res.status === 200) {
                        resetFields();
                        setFetching(true);
                        getComments();
                    } else {
                        setErrorMessage(res.result)
                    }
                });
            }
        });
    }

    return (
        <div className="mg-b-20 df-examples" data-label="Comments">
            {type !== 'chat' && (
                <h6 className="tx-uppercase tx-semibold mg-b-10">Comment(s)</h6>
            )}
            {authenticated && (
                <Form hideRequiredMark={false} onSubmit={postComment}>
                    <small className="text-danger">{errorMessage}</small>
                    <Comment
                        avatar={<Avatar src={logg.avatar_link} alt={logg.fullname} />}
                        content={
                            <div className="row row-xs">
                                <div className="col-10">
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        {getFieldDecorator('content', {
                                            rules: [{ required: true, message: 'Comment is required' }]
                                        })(
                                            <Input size="large" rows={2} autoComplete="off" placeholder="Type your comment..." />
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-2">
                                    <Button htmlType="submit" loading={submitting} disabled={!getFieldValue('content')} type="primary">
                                        Send
                                    </Button>
                                </div>
                            </div>
                        }
                    />
                </Form>
            )}

            {loading === true && (
                <div>loading {type === 'chat' ? 'chats' : 'comments'}...</div>
            )}

            {loading === false && (
                comments.map(row => (<CommentTemplate key={row.id} row={row} />))
            )}
        </div>
    );
};

const CommentTemplate = props => {
    const row = props.row;
    return (
        <Comment
            actions={[
                // <span key="comment-basic-like">
                //     <Tooltip title="Like">
                //         <LikeOutlined />
                //     </Tooltip>
                //     <span className="comment-action">0</span>
                // </span>,
                // <span key='key="comment-basic-dislike"'>
                //     <Tooltip title="Dislike">

                //     </Tooltip>
                //     <span className="comment-action">0</span>
                // </span>,
                // <span key="comment-basic-reply-to">Reply to</span>
            ]}
            author={<Link to={`/u/${row.user.username}`}>{row.user.username} - {row.crdate_ago}</Link>}
            avatar={<Avatar src={row.user.avatar_link} alt={row.user.fullname} />}
            content={<div dangerouslySetInnerHTML={{ __html: row.content }}></div>}
        >
        </Comment>
    )
}

const Comments = Form.create()(CommentsC);
export default Comments;