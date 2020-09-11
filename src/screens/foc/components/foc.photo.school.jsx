import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, message } from 'antd';

const FocPhotoSchool = props => {
    const contest = parseInt(props.match.params.contest.split('.')[1]);
    const { row, school, data, _auth: { authenticated, logg }, _foc: { voting } } = props;
    const [voted, setVoted] = useState(row.voted);

    const vote = async (school) => {
        if (authenticated === true) {
            props.focVoteSchool(school, { contest, school, voter: logg.id, type: 'photo' }, (status, result) => {
                if (status === 200) {
                    setVoted(true);
                    message.success(result);
                } else {
                    message.error(result);
                }
            });
        } else {
            message.info('You must sign in to place a vote');
        }
    }

    return (
        <div className="col-12 col-sm-4 col-lg-4 mg-b-25">
            <Link to={`/face-of-campus/photo/school/${row.contest.slug}.${row.contest.id}/${row.school.slug}.${row.school.id}`} key={school}>
                <div className="bg-gray-100 pd-20">
                    <div className="text-center text-uppercase mg-b-15"><b>{school}</b></div>
                    <div className="img-group">
                        {data[school].map(row => (
                            <img src={row.user.avatar_link} alt={row.user.fullname} className="img wd-100 ht-100 rounded-circle" />
                        ))}
                    </div>
                </div>
            </Link>
            {data[school][0].contest.canvote === true && (
                <Button type="primary" outline block size="small" loading={voting === data[school][0].school.id} disabled={voted} onClick={() => vote(data[school][0].school.id)}>
                    {voted ? 'Voted' : 'Vote All'}
                </Button>
            )}
        </div>
    );

};

export default FocPhotoSchool;