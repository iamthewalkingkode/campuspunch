import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as func from '../../utils/functions';
import AcademySidebar from './components/Sidebar';
import { Loading, PayModal } from '../../components';
import { Modal, Button } from 'antd';

class AcademyIntro extends Component {

    state = {
        loading: true, payVisible: false, planVisible: false,
        courses: [], tutors: [], payAmount: 0, ipaid: 0,
        level: parseInt(this.props.match.params.level.split('.')[1]),
        school: parseInt(this.props.match.params.school.split('.')[1]),
        department: parseInt(this.props.match.params.department.split('.')[1])
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Academy', description: '', keywords: '' });
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        this.props.setFooterTop({ h1: 'Become a Partner', p: 'Transform someone\'s life, a group, or your employees career skills by sponsoring them to learn a course', btnText: 'Get Started Now', btnAction: 'partner-form', image: '' });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        const { department, level } = this.state;
        func.post('academy/courses', { department, level, lessons: 'yes', status: 1 }).then((res) => {
            this.setState({ loading: false });
            if (res.status === 200) {
                let crs = res.result[0];
                this.props.setHeaderBottom({ h1: 'Academy', h3: `${crs.school.name} - ${crs.departments.filter(dep => dep.id === department)[0]['name']}`, p: 'Introduction', image: 'banner/academy.png' });
                this.setState({ courses: res.result });
            } else {
                this.setState({ courses: [] });
                let self = this;
                Modal.info({
                    title: 'No courses',
                    content: `We did not find any courses in this department.`,
                    okText: 'Go back',
                    onOk() {
                        self.props.history.goBack();
                    }
                });
            }
        });

        func.post('academy/payments_total', { department, level, user: this.props._auth.logg.id }).then((res) => {
            if (res.status === 200) {
                this.setState({ ipaid: res.result });
            }
        });

        func.post('academy/tutors', { type: 1, status: 1, level, department }).then((res) => {
            if (res.status === 200) {
                this.setState({ tutors: res.result });
            }
        });
    }

    startAcademy = (e) => {
        const { _auth: { authenticated } } = this.props;
        if (authenticated === true) {
            if (this.state.ipaid > 0) {
                this.enterAcademy();
            } else {
                this.setState({ planVisible: true });
            }
        } else {
            let self = this;
            Modal.confirm({
                title: 'Sign in',
                content: `You need to sign in to gain access to Academy`,
                okText: 'Sign in',
                onOk() {
                    self.props.history.push(`/user/signin`);
                }
            });
        }
    }

    enterAcademy = () => {
        this.props.history.push(`${this.props.location.pathname.split('intro').join('enter')}`);
    }

    render() {
        const { loading, courses, tutors, payAmount, payVisible, planVisible, ipaid, department, level } = this.state;

        return (
            <React.Fragment>
                {loading === true && (
                    <Loading text="loading courses..." />
                )}

                {loading === false && courses.length > 0 && (
                    <div>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-style2 bg-gray-100 pd-12">
                                <li className="breadcrumb-item"><Link to="/academy">Academy</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Introduction</li>
                            </ol>
                        </nav>

                        <div className="row">
                            <div className="col-lg-4 col-12">
                                <AcademySidebar
                                    {...this.props} display="intro"
                                    school={courses[0].school.name}
                                    category={courses[0].category}
                                    department={courses[0].departments.filter(dep => dep.id === department)[0].name}
                                    payCourse={() => this.startAcademy()}
                                />
                            </div>
                            <div className="col-lg-8 col-12">
                                <div className="mg-b-25">
                                    <h3 className="text-center">What you will learn</h3>
                                </div>
                                <div className="pd-15 bg-gray-200 mg-b-25">
                                    {courses.map(crs => (
                                        <div>
                                            <b>{crs.title}</b>
                                            <ul>
                                                {crs.lessons.map(lss => (
                                                    <li>{lss.title}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                <div className="mg-b-25">
                                    <h3 className="text-center">Why You'll Love This Course</h3>
                                    <ul>
                                        <li>Earn an internationally recognized certificate at the end of this course.</li>
                                        <li>Offers proper discipline to ensure you complete your lessons.</li>
                                        <li>This course provides the highest quality and affordable online academy.</li>
                                        <li>Learn from several experts on a single subject.</li>
                                        <li>This course is handled by at least two professionals.</li>
                                        <li>All our videos are very short and fully transcribed.</li>
                                        <li>Videos are available in mp4, mp3, pdf, and doc format.</li>
                                        <li>All courses are completely practical.</li>
                                        <li>Find thought provoking test at the end of each lesson.</li>
                                        <li>Have access to one and one chat with any tutor anytime.</li>
                                        <li>Job offer available for all best graduating students.</li>
                                    </ul>
                                </div>
                                <div className="row mg-t-25">
                                    <div className="col-sm-4"></div>
                                    <div className="col-sm-4"><Button type="primary" block onClick={() => this.startAcademy()}>Start</Button></div>
                                    <div className="col-sm-4"></div>
                                </div>

                                {tutors.length > 0 && (
                                    <div className="list-group mg-t-50">
                                        <h4 className="text-center">Meet the tutor</h4>
                                        {tutors.map(tut => (
                                            <div className="list-group-item d-flex align-items-centers">
                                                <img src={tut.avatar_link} className="wd-80 ht-80 mg-r-15 rounded-circle" alt={tut.username} />
                                                <div className="">
                                                    <h6 className="tx-inverse tx-semibold mg-b-0">{tut.fullname}</h6>
                                                    <span className="d-block text-muted mg-t-5">{tut.about}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <Modal title="Choose your plan" visible={planVisible} onCancel={() => this.setState({ planVisible: false })} footer={null}>
                    {ipaid === 0 && (
                        <div className="pointer pd-12 mg-b-15" onClick={() => this.setState({ payVisible: true, payAmount: 200, planVisible: false })} style={{ background: '#e5e9f2' }}>
                            Past Questions: <b className="text-primary">₦200</b>
                        </div>
                    )}
                    <div className="pointer pd-12" onClick={() => this.setState({ payVisible: true, payAmount: 3000, planVisible: false })} style={{ background: '#e5e9f2' }}>
                        Video Lessons + Personal Tutor: <b className="text-primary">₦3000</b>
                    </div>
                </Modal>

                <PayModal
                    {...this.props}
                    visible={payVisible}
                    amount={payAmount}
                    level={level}
                    department={department}
                    type="academy"
                    title={`Pay & continue (₦${payAmount})`}
                    onCancel={() => this.setState({ payVisible: false, planVisible: true })}
                    paySuccessData={{ level, department }}
                    paySuccess={(e) => this.enterAcademy()}
                />
            </React.Fragment>
        )
    }

}

export default AcademyIntro;