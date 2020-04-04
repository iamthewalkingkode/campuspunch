import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import * as func from '../../utils/functions';
import AcademySidebar from './components/Sidebar';
import { Loading } from '../../components';

class AcademyCourses extends Component {

    state = {
        loading: true, payVisible: false, planVisible: false,
        courses: [], payAmount: 0, ipaid: 0,

        path: this.props.location.pathname.split('courses').join('enter').split('/'),
        year: parseInt(this.props.match.params.year),
        level: parseInt(this.props.match.params.level.split('.')[1]),
        school: parseInt(this.props.match.params.school.split('.')[1]),
        department: parseInt(this.props.match.params.department.split('.')[1])
    }

    componentDidMount() {
        let self = this;
        this.props.setMetaTags({ title: 'Academy', description: '', keywords: '' });
        this.props.setHeaderTitle({ h1: '', h3: '', p: '', image: '' });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        const { department, level, year } = this.state;
        func.post('academy/payments_total', { department, level, user: this.props.auth.logg.id }).then((res) => {
            if (res.status === 200) {
                if (res.result > 0) {
                    func.post('academy/courses', { department, level, lessons: 'yess', status: 1 }).then((res) => {
                        this.setState({ loading: false });
                        if (res.status === 200) {
                            let crs = res.result[0];
                            this.props.setHeaderTitle({ h1: 'Academy', h3: `${crs.school.name} - ${crs.departments.filter(dep => dep.id === department)[0]['name']}`, p: `${year} courses`, image: 'banner/academy.png' });
                            this.setState({ courses: res.result });
                        } else {
                            this.setState({ courses: [] });
                            Modal.info({
                                title: 'No courses',
                                content: `We did not find any courses in this department and level.`,
                                okText: 'Go back',
                                onOk() {
                                    self.props.history.goBack();
                                }
                            });
                        }
                    });
                } else {
                    this.setState({ loading: false });
                    Modal.info({
                        title: 'Please pay',
                        content: `You have not paid for this section`,
                        onOk() {
                            const path = self.props.location.pathname.split('courses').join('enter').split('/');
                            self.props.history.push(`/${path[1]}/${path[2]}/${path[3]}/${path[4]}/${path[5]}`);
                        }
                    });
                }
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

    enterQuestions = (crs) => {
        let self = this;
        Modal.confirm({
            title: 'Ready ?',
            content: `You are about to open "${crs.title}". This will automatically start the timer for the 1st Question. Are you ready?`,
            okText: 'Yes, Start',
            onOk() {
                self.props.history.push(`${self.props.location.pathname.split('courses').join('questions')}/${crs.slug}.${crs.id}`);
            }
        });
    }

    render() {
        const { loading, courses, path } = this.state;

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
                                <li className="breadcrumb-item"><Link to={`/${path[1]}/intro/${path[3]}/${path[4]}/${path[5]}`}>Introduction</Link></li>
                                <li className="breadcrumb-item"><Link to={`/${path[1]}/enter/${path[3]}/${path[4]}/${path[5]}`}>Academy</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Courses</li>
                            </ol>
                        </nav>

                        <div className="row">
                            <div className="col-lg-4 col-12">
                                <AcademySidebar display="menu" {...this.props} />
                            </div>
                            <div className="col-lg-8 col-12">
                                <div className="pd-15 bg-gray-200">
                                    {courses.map(crs => (
                                        <div>
                                            <b className="text-primary pointer" onClick={() => this.enterQuestions(crs)}>{crs.title}</b>
                                            <ul>
                                                {crs.lessons.map(lss => (
                                                    <li>{lss.title}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        )
    }

}

export default AcademyCourses;