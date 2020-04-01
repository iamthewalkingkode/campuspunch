import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as func from '../../utils/functions';
import AcademySidebar from './components/Sidebar';
import { Loading } from '../../components';
import { Modal } from 'antd';

class AcademyLessons extends Component {

    state = {
        loading: true,
        courses: [], ipaid: 0,
        path: this.props.location.pathname.split('/'),
        level: parseInt(this.props.match.params.level.split('.')[1]),
        school: parseInt(this.props.match.params.school.split('.')[1]),
        department: parseInt(this.props.match.params.department.split('.')[1])
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Academy', description: '', keywords: '' });
        this.props.setHeaderTitle({ h1: '', h3: '', p: '', image: '' });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        const { department, level, path } = this.state;
        func.post('academy/payments_total', { department, level, user: this.props.auth.logg.id }).then((res) => {
            if (res.status === 200) {
                if (res.result >= 3000) {
                    func.post('academy/courses', { department, level, lessons: 'yes' }).then((res) => {
                        this.setState({ loading: false });
                        if (res.status === 200) {
                            let crs = res.result[0];
                            this.props.setHeaderTitle({ h1: 'Academy', h3: `${crs.school.name} - ${crs.departments.filter(dep => dep.id === department)[0]['name']}`, p: `Lessons`, image: '' });
                            this.setState({ courses: res.result });
                        } else {
                            this.setState({ courses: [] });
                        }
                    });
                } else {
                    this.setState({ loading: false });
                    let self = this;
                    Modal.info({
                        title: 'Please pay',
                        content: `You have not paid for this section`,
                        onOk() {
                            self.props.history.push(`/${path[1]}/enter/${path[3]}/${path[4]}/${path[5]}`);
                        }
                    });
                }
            }
        });
    }

    enterLesson = (crs) => {
        this.props.history.push(`${this.props.location.pathname.split('lessons').join('lesson')}/${crs.slug}.${crs.id}`);
    }

    render() {
        const { loading, courses, path } = this.state;

        return (
            <React.Fragment>
                {loading === true && (
                    <Loading text="loading lessons..." />
                )}

                {loading === false && courses.length > 0 && (
                    <div>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-style2 bg-gray-100 pd-12">
                                <li className="breadcrumb-item"><Link to="/academy">Academy</Link></li>
                                <li className="breadcrumb-item"><Link to={`/${path[1]}/intro/${path[3]}/${path[4]}/${path[5]}`}>Introduction</Link></li>
                                <li className="breadcrumb-item"><Link to={`/${path[1]}/enter/${path[3]}/${path[4]}/${path[5]}`}>Enter</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Lessons</li>
                            </ol>
                        </nav>

                        <div className="row">
                            <div className="col-lg-4 col-12">
                                <AcademySidebar display="menu" {...this.props} />
                            </div>
                            <div className="col-lg-8 col-12">
                                <div className="pd-15 bg-gray-200">
                                    {courses.map(crs => (
                                        crs.lessons.length > 0 && (
                                            <div>
                                                <b className="text-primary pointer" onClick={() => this.enterLesson(crs)}>{crs.title}</b>
                                                <ul>
                                                    {crs.lessons.map(lss => (
                                                        <li>{lss.title}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )
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

export default AcademyLessons;