import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Comment, Avatar } from 'antd';
import * as func from '../utils/functions';
import { Link } from 'react-router-dom';
import publicIp from 'public-ip';

const CommentsC = props => {
    const { type, item, auth: { logg, authenticated } } = props;

    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getComments = () => {
        setLoading(true);
        func.post('comments', { item, type, limit: 12 }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setComments(res.result);
            }
        });
    }

    const submit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSubmitting(true);
        const ip = await publicIp.v4({ fallbackUrls: ['https://ifconfig.co/ip'] });
        func.post('comments/insert', { item, type, user: logg.id, content, ip }).then(res => {
            setSubmitting(false);
            if (res.status === 200) {
                setContent('');
                getComments();
            } else {
                setErrorMessage(res.result);
            }
        });
    }

    return (
        <div className="mg-b-20 df-examples" data-label="Comments">
            {type !== 'chat' && (
                <h6 className="tx-uppercase tx-semibold mg-b-10">Comment(s)</h6>
            )}
            {authenticated && (
                <Form hideRequiredMark={false} onSubmit={submit}>
                    <small className="text-danger">{errorMessage}</small>
                    <Comment
                        avatar={<Avatar src={logg.avatar_link} alt={logg.fullname} />}
                        content={
                            <div id="comment___form">
                                <Input size="large" autoComplete="off" placeholder={`Type here...`} value={content} onChange={e => setContent(e.target.value)} />
                                <Button htmlType="submit" type="primary" loading={submitting} disabled={!content}>
                                    Send
                                </Button>
                                <div className="clearfix" />
                            </div>
                        }
                    />
                </Form>
            )}

            {loading === true && (
                <div className="text-center">loading {type === 'chat' ? 'chats' : 'comments'}...</div>
            )}

            {loading === false && (
                comments.map(row => (<CommentTemplate key={row.id} row={row} {...props} />))
            )}
        </div>
    );
};

const CommentTemplate = props => {
    const { auth: { logg } } = props;
    const [row, setRow] = useState(props.row);
    const action = (action) => {
        func.post('comments/action', { action, comment: row.id, user: logg.id }).then(res => {
            if (res.status === 200) {
                setRow(res.data);
            }
        });
    }

    return (
        <Comment
            actions={[
                <span key="like" onClick={() => action('likes')}>
                    <i className="fa fa-thumbs-up tet"></i>&nbsp;
                    <span className="comment-action">{row.likes > 9999 ? row.likes_sf : row.likes_nf}</span>
                </span>,
                <span key="dislike" onClick={() => action('dislikes')}>
                    <i className="fa fa-thumbs-down"></i>&nbsp;
                    <span className="comment-action">{row.dislikes > 9999 ? row.dislikes_sf : row.dislikes_nf}</span>
                </span>
            ]}
            author={<Link to={`/u/${row.user.username}`}>{row.user.username} - {row.crdate_ago}</Link>}
            avatar={<Avatar src={row.user.avatar_link} alt={row.user.fullname} />}
            content={<div dangerouslySetInnerHTML={{ __html: row.content }}></div>}
        >
        </Comment>
    );
}

const Comments = Form.create()(CommentsC);
export default Comments;