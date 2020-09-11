import React, { useState } from 'react';
import { Button, message } from 'antd';
import { isMobile } from 'react-device-detect';

const FocDanceCard = props => {
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
        props.history.push(`/face-of-campus/dance/${contest.slug}.${contest.id}/${user.username}.${user.id}`);
    }

    return (
        <React.Fragment>
            <div className="card mg-b-20">
                <div className="card-body">
                    <div className="row">
                        <div className="col-12 col-lg-7">
                            <iframe src={`https://www.youtube-nocookie.com/embed/${row.dance.video_code}`} title={row.title}
                                height={isMobile ? '240px' : '240px'} width="100%" frameBorder="0"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style={{ background: '#000' }}
                            />
                        </div>
                        <div className="col-12 col-lg-5">
                            <div className="badge badge-secondary" children={`${row.votes_nf} votes`} />
                            <h4>{row.dance.title}</h4>
                            <p className={`${!isMobile ? 'ht-100 bg-gray-100s' : ''}`}>{row.dance.description ? row.dance.description_small + '...' : ''}</p>
                            <div className="pd-5 d-flex flex-row">
                                <Button block type="secondary" className="text-white" onClick={() => open(row)}>View</Button>
                                {row.contest.canvote === true && voted === false && (
                                    <Button block type="primary" className="mg-l-10" loading={voting === (row.user.id + contest)} onClick={() => vote(row.user.id)}>Vote</Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );

};

export default FocDanceCard;