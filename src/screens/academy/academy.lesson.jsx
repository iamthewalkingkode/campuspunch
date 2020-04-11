import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as func from '../../utils/functions';
import { Loading, Comments } from '../../components';
import { Modal, Button } from 'antd';
import { isMobile } from 'react-device-detect';

class AcademyLesson extends Component {

    state = {
        loading: true, index: 0, year: 0,
        lessons: [], questions: false, lss: {},
        path: this.props.location.pathname.split('courses').join('enter').split('/'),
        pathname: this.props.location.pathname.split('/academy/lesson/').join('').split('/').join('.'),
        course: parseInt(this.props.match.params.course.split('.')[1]),
        level: parseInt(this.props.match.params.level.split('.')[1]),
        school: parseInt(this.props.match.params.school.split('.')[1]),
        department: parseInt(this.props.match.params.department.split('.')[1])
    }

    componentDidMount() {
        let self = this;
        this.props.setMetaTags({ title: 'Academy', description: '', keywords: '' });
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });

        const { department, level, course, school, path } = this.state;
        func.post('academy/payments_total', { department, level, user: this.props.auth.logg.id }).then((res) => {
            if (res.status === 200) {
                if (res.result >= 3000) {
                    func.post('academy/lessons', { course, department, school, status: 1, orderby: 'number_asc' }).then((res) => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        this.setState({ loading: false });
                        if (res.status === 200) {
                            let lss = res.result[0];
                            this.props.setHeaderBottom({ h1: 'Academy', h3: `${lss.school.name} - ${lss.department.name}`, p: lss.title, image: 'banner/academy.png' });
                            this.setState({ lessons: res.result }, () => {
                                this.getActiveLesson();
                            });
                        } else {
                            this.setState({ lessons: [] });
                            Modal.info({
                                title: 'No lessons',
                                content: `We did not find any lessons in this course.`,
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
                            self.props.history.push(`/${path[1]}/${path[2]}/${path[3]}/${path[4]}/${path[5]}`);
                        }
                    });
                }
            }
        });
    }

    getActiveLesson() {
        const { pathname, lessons } = this.state;
        const index = parseInt(func.getStorage(`${pathname}.academy.lessons.index`) || 0);
        const lss = lessons[index];
        this.setState({ index, lss }, () => {
            func.setStorage(`${pathname}.academy.lessons.index`, index);
            this.getQuestions(lss.id);
        });
    }

    getQuestions(lesson) {
        func.post('academy/questions', { lesson, limit: 1, tolesson: true }).then(res => {
            if (res.status === 200) {
                this.setState({ questions: true, year: res.result[0].year });
            }
        });
    }

    navigateLesson = (operator = '-') => {
        const { pathname } = this.state;
        let index = parseInt(func.getStorage(`${pathname}.academy.lessons.index`) || 0);
        index = operator === '-' ? index - 1 : index + 1;
        func.setStorage(`${pathname}.academy.lessons.index`, index);
        this.setState({ index, lss: {} }, () => {
            this.getActiveLesson();
        });
    }

    showTranscript() {
        window.$('#transcript').toggle('show');
        window.$('#strans').hide();
        window.$('#htrans').show();
    }
    hideTranscript() {
        window.$('#transcript').toggle('show');
        window.$('#htrans').hide();
        window.$('#strans').show();
    }

    render() {
        const { loading, lessons, lss, path, index, school, department, level, course, questions, year } = this.state;

        return (
            <React.Fragment>
                {loading === true && (
                    <Loading text="loading lessons..." />
                )}

                {loading === false && lessons.length > 0 && (
                    <div>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-style2 bg-gray-100 pd-12">
                                <li className="breadcrumb-item"><Link to="/academy">Academy</Link></li>
                                <li className="breadcrumb-item"><Link to={`/${path[1]}/intro/${path[3]}/${path[4]}/${path[5]}`}>Introduction</Link></li>
                                <li className="breadcrumb-item"><Link to={`/${path[1]}/enter/${path[3]}/${path[4]}/${path[5]}`}>Academy</Link></li>
                                <li className="breadcrumb-item"><Link to={`/${path[1]}/lessons/${path[3]}/${path[4]}/${path[5]}`}>Lessons</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">{lss.title}</li>
                            </ol>
                        </nav>

                        <div className="">
                            {lss.video && (
                                <iframe src={`https://www.youtube-nocookie.com/embed/${lss.video}`} title={lss.title}
                                    height={isMobile ? '250px' : '550px'} width="100%" frameBorder="0"
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style={{ background: '#000' }}
                                />
                            )}
                            <div className="mg-b-40">
                                <span className="pointer" id="strans" onClick={() => this.showTranscript()}><b>View Transcript</b></span>
                                <span className="pointer" id="htrans" onClick={() => this.hideTranscript()} style={{ display: 'none' }}><b>Close Transcript</b></span>
                            </div>
                            <h2>{lss.title}</h2>
                            <p id="transcript" className="text-justifys pd-15 bg-gray-100 mg-b-25" style={{ display: 'none' }}>
                                <span dangerouslySetInnerHTML={{ __html: lss.transcript }}></span>
                            </p>
                            <p className="text-justifys mg-b-40">
                                <span dangerouslySetInnerHTML={{ __html: lss.instruction }}></span>
                            </p>
                            <div className="mg-b-50">
                                {index > 0 && (
                                    <Button type="primary" size="small" className="float-left" onClick={() => this.navigateLesson('-')}>&laquo; Previous lesson</Button>
                                )}
                                {(index + 1) < lessons.length && questions === false && (
                                    <Button type="primary" className="float-right" onClick={() => this.navigateLesson('+')}>Next lesson &raquo;</Button>
                                )}
                                {(index + 1) < lessons.length && questions === true && (
                                    <Button type="danger" className="float-right" onClick={() => this.props.history.push(`/${path[1]}/questions/${path[3]}/${path[4]}/${path[5]}/${year}/${path[6]}/${lss.slug}.${lss.id}`)}>Take Test &raquo;</Button>
                                )}
                                <div className="clearfix"></div>
                            </div>
                            {lss.id && (
                                <Comments item={`${school}-${department}-${level}-${course}-${lss.id}`} type="lesson" {...this.props} />
                            )}
                        </div>
                    </div>
                )}
            </React.Fragment>
        )
    }

}

export default AcademyLesson;