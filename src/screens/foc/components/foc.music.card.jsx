import React, { useState } from 'react';
import { Button, message } from 'antd';

const FocMusicCard = props => {
    const contest = parseInt(props.match.params.contest.split('.')[1]);
    const { row, _auth: { authenticated, logg }, _foc: { voting } } = props;
    const [voted, setVoted] = useState(row.contestant.voted);

    const vote = (user) => {
        if (authenticated === true) {
            props.focVote(user + contest, { contest, user, school: row.contestant.school.id, voter: logg.id, type: 'music' }, (status, result) => {
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

    const open = (row) => {
        const user = row.contestant.user;
        const contest = row.contestant.contest;
        props.history.push(`/face-of-campus/music/${contest.slug}.${contest.id}/${user.username}.${user.id}`);
    }

    return (
        <div className="col-12 col-lg-6 mg-b-25">
            <div className="card">
                <div className="card-bodys bg-gray-100" dangerouslySetInnerHTML={{ __html: row.song_small }} />
                <div className="card-footer pd-5 d-flex flex-row">
                    <Button block type="secondary" className="text-white" onClick={() => open(row)}>View</Button>
                    {row.contestant.contest.canvote === true && (
                        <Button block type="primary" className="mg-l-10" disabled={voted} loading={voting === (row.contestant.user.id + contest)} onClick={() => vote(row.contestant.user.id)}>Vote</Button>
                    )}
                </div>
            </div>
        </div>
    );

};

export default FocMusicCard;