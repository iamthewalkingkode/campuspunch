import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, message } from 'antd';
import * as func from '../../utils/functions';

const FocPhotoProfileCard = props => {
    const { row, auth: { authenticated } } = props;
    const [voted, setVoted] = useState(row.voted);
    const [submitting, setSubmitting] = useState(false);

    const vote = (user) => {
        if (authenticated === true) {
            setSubmitting(true);
            const { match: { params: { school, contest } }, auth: { logg } } = props;
            func.post('foc/vote', { contest: parseInt(contest), user, school: parseInt(school), voter: logg.id, type: 'photo' }).then(res => {
                setSubmitting(false);
                if (res.status === 200) {
                    setVoted(true);
                    message.success(res.result);
                } else {
                    message.error(res.result);
                }
            });
        } else {
            message.warning('You must sign in to place a vote');
        }
    }

    return (
        <div class="card">
            <p class="card-title text-center pd-t-10">{row.user.username}</p>
            <Link to={`/face-of-campus/photo/profile/${row.user.username}/${row.user.id}/${row.contest.id}`}>
                <img src={row.user.avatar_link} class="card-img-top" alt={row.user.username} />
            </Link>
            <div className="card-footer d-flex">
                <Button type="primary" outline block size="small" disabled={voted} loading={submitting} onClick={() => vote(row.user.id)}>
                    {voted ? 'Voted' : 'Vote'}
                </Button>
            </div>
        </div>
    );

};

export default FocPhotoProfileCard;