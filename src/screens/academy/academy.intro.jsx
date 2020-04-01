import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as func from '../../utils/functions';
import AcademySidebar from './components/Sidebar';
import { Loading, PayModal } from '../../components';
import { Modal, Button } from 'antd';

class AcademyIntro extends Component {

    state = {
        loading: true, payVisible: false, planVisible: false,
        courses: [], payAmount: 0, ipaid: 0,
        level: parseInt(this.props.match.params.level.split('.')[1]),
        school: parseInt(this.props.match.params.school.split('.')[1]),
        department: parseInt(this.props.match.params.department.split('.')[1])
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Academy', description: '', keywords: '' });
        this.props.setHeaderTitle({ h1: 'Academy', h3: '', p: 'Introduction', image: '' });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        const { department, level } = this.state;
        func.post('academy/courses', { department, lessons: 'yes', status: 1 }).then((res) => {
            this.setState({ loading: false });
            if (res.status === 200) {
                let crs = res.result[0];
                this.props.setHeaderTitle({ h1: 'Academy', h3: `${crs.school.name} - ${crs.departments.filter(dep => dep.id === department)[0]['name']}`, p: 'Introduction', image: '' });
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

        func.post('academy/payments_total', { department, level, user: this.props.auth.logg.id }).then((res) => {
            if (res.status === 200) {
                this.setState({ ipaid: res.result });
            }
        });
    }

    startAcademy = (e) => {
        const { auth: { authenticated } } = this.props;
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
        const { loading, courses, payAmount, payVisible, planVisible, ipaid, department, level } = this.state;

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
                                <AcademySidebar {...this.props} display="intro" category={'student'} payCourse={() => this.startAcademy()} />
                            </div>
                            <div className="col-lg-8 col-12">
                                <div className="pd-15" style={{ backgroundColor: '#e5e9f2' }}>
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
                                <div className="row mg-t-25">
                                    <div className="col-sm-4"></div>
                                    <div className="col-sm-4"><Button type="primary" block onClick={() => this.startAcademy()}>Start</Button></div>
                                    <div className="col-sm-4"></div>
                                </div>
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