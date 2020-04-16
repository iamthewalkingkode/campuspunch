import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, message } from 'antd';

const FocPhotoProfileCard = props => {
    const school = parseInt(props.match.params.school.split('.')[1]);
    const contest = parseInt(props.match.params.contest.split('.')[1]);
    const { row, _auth: { authenticated, logg }, _foc: { voting } } = props;
    const [voted, setVoted] = useState(row.voted);

    const vote = (user) => {
        if (authenticated === true) {
            props.focVote(user + contest, { contest, user, school, voter: logg.id, type: 'photo' }, (status, result) => {
                if (status === 200) {
                    setVoted(true);
                    message.success(result);
                } else {
                    message.error(result);
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
            {row.contest.canvote === true && (
                <div className="card-footer d-flex">
                    <Button type="primary" outline block size="small" disabled={voted} loading={voting === (row.user.id + contest)} onClick={() => vote(row.user.id)}>
                        {voted ? 'Voted' : 'Vote'}
                    </Button>
                </div>
            )}
        </div>
    );

};

export default FocPhotoProfileCard;