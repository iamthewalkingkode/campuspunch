import React from 'react';
import * as func from '../../../utils/functions';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const AcademySidebar = props => {
    const ipay = 3000;
    const { display, category, school, department } = props;
    const path = props.history.location.pathname.split('/');

    return (
        <React.Fragment>
            <div id="academy__sidebar" className="pd-15 bg-gray-200">
                {display === 'menu' && (
                    <div className="menu">
                        <Link className={path[2] === 'courses' ? 'active' : ''} to={`/academy/courses/${path[3]}/${path[4]}/${path[5]}`}>ABC Questions</Link>
                        <Link className={path[2] === 'lessons' ? 'active' : ''} to={`/academy/lessons/${path[3]}/${path[4]}/${path[5]}`}>Lessons</Link>
                        <Link className={path[2] === 'chat' ? 'active' : ''} to={`/academy/chat/${path[3]}/${path[4]}/${path[5]}`}>Lecturer's Chat</Link>
                        <Link className={path[2] === 'ressources' ? 'active' : ''} to={`/academy/ressources/${path[3]}/${path[4]}/${path[5]}`}>Ressources</Link>
                    </div>
                )}

                {display === 'intro' && (
                    <span className="text-center">
                        <h3 style={{ margin: '0px', padding: '15px' }}>Introduction</h3>
                        {category === 'student' && (
                            <p>Gain access to {school} Computer Engineering 100 level Course outline, exam past questions and answers, lesson notes and videos.</p>
                        )}

                        {category === 'graduate' && (
                            <p>Join a well organized Online ICAN Class. Get all ICAN materials, video tutorials, classes, past questions and answers online. Receive guidelines from professors and transform your career journey. Also find a great way to connect with other ICAN colleagues and practice your profession.</p>
                        )}

                        {category === 'jambite' && (
                            <p>Free Online {department} Past Question papers and answers. Practice {department} CBT past questions both online and offline. Do you want to get ready for {func.dates.yr} {department} UTME Exams? Start Now.</p>
                        )}

                        {category === 'non-campus' && (
                            <p>Learn {department} like a pro. Have one-one training session with a Professional with tons of practical assignments, video tutorials and acquire a recognized certificate. And you know what's more interesting? You'd be guided by a personal tutor.</p>
                        )}

                        {/* <p>&nbsp;</p> */}
                        {ipay > 0 && (
                            <div className="text-center">
                                <b className="text-primary">₦{ipay.toLocaleString()}</b>
                            </div>
                        )}
                        <p>&nbsp;</p>
                        <Button type="primary" block onClick={() => props.payCourse()}>Start</Button>
                    </span>
                )}
            </div>
        </React.Fragment>
    );

};
export default AcademySidebar;