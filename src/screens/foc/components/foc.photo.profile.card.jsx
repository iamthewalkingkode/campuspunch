import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, message } from 'antd';
import * as func from '../../../utils/functions';
import publicIp from 'public-ip';

const FocPhotoProfileCard = props => {
    const school = parseInt(this.props.match.params.school.split('.')[1]);
    const contest = parseInt(this.props.match.params.contest.split('.')[1]);
    const { row, auth: { authenticated } } = props;
    const [voted, setVoted] = useState(row.voted);
    const [submitting, setSubmitting] = useState(false);

    const vote = async (user) => {
        if (authenticated === true) {
            setSubmitting(true);
            const ip = await publicIp.v4({ fallbackUrls: ['https://ifconfig.co/ip'] });
            const { auth: { logg } } = props;
            func.post('foc/vote', { contest, user, school, voter: logg.id, type: 'photo', ip }).then(res => {
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
        <div className="card">
            <p className="card-title text-center pd-t-10">{row.user.username}</p>
            <Link to={`/face-of-campus/photo/profile/${row.contest.slug}.${row.contest.id}/${row.user.username}.${row.user.id}`}>
                <img src={row.user.avatar_link} className="card-img-top" alt={row.user.username} />
            </Link>
            {row.canvote === true && (<div className="card-footer d-flex">
                <Button type="primary" outline block size="small" disabled={voted} loading={submitting} onClick={() => vote(row.user.id)}>
                    {voted ? 'Voted' : 'Vote'}
                </Button>
            </div>
            )}
        </div>
    );

};

export default FocPhotoProfileCard;