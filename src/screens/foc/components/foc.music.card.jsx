import React, { useState } from 'react';
import { Button, message } from 'antd';

const FocMusicCard = props => {
    const contest = parseInt(props.match.params.contest.split('.')[1]);
    const { row, _auth: { authenticated, logg }, _foc: { voting } } = props;
    const [voted, setVoted] = useState(row.voted);

    const vote = (user) => {
        if (authenticated === true) {
            props.focVote(user + contest, { contest, user, school: row.school.id, voter: logg.id, type: 'music' }, (status, result) => {
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
        const user = row.user;
        const contest = row.contest;
        props.history.push(`/face-of-campus/music/${contest.slug}.${contest.id}/${user.username}.${user.id}`);
    }

    return (
        <div className="col-12 col-lg-6 mg-b-25">
            <div className="card">
                <div className="card-bodys bg-gray-100" dangerouslySetInnerHTML={{ __html: row.music.song_small }} />
                <div className="card-footer pd-5 d-flex flex-row">
                    <Button block type="secondary" className="text-white" onClick={() => open(row)}>View</Button>
                    {row.contest.canvote === true && (
                        <Button block type="primary" className="mg-l-10" disabled={voted} loading={voting === (row.user.id + contest)} onClick={() => vote(row.user.id)}>Vote</Button>
                    )}
                </div>
            </div>
        </div>
    );

};

export default FocMusicCard;