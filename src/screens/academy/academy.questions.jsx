import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as func from '../../utils/functions';
import { Loading } from '../../components';
import { Button, Modal } from 'antd';

const alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

class AcademyQuestions extends Component {

    state = {
        loading: true, saved: false,
        questions: [], que: {}, time: '00:00:00', index: 0, correct: 0, timeInterval: null,

        path: this.props.location.pathname.split('courses').join('enter').split('/'),
        pathname: this.props.location.pathname.split('/academy/questions/').join('').split('/').join('.'),
        year: parseInt(this.props.match.params.year),
        course: parseInt(this.props.match.params.course),
        level: parseInt(this.props.match.params.level.split('.')[1]),
        school: parseInt(this.props.match.params.school.split('.')[1]),
        department: parseInt(this.props.match.params.department.split('.')[1])
    }

    componentDidMount() {
        const self = this;
        this.props.setMetaTags({ title: 'Academy', description: '', keywords: '' });
        this.props.setHeaderTitle({ h1: '', h3: '', p: '', image: '' });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        const { department, level, year, course, path } = this.state;
        func.post('academy/payments_total', { department, level, user: this.props.auth.logg.id }).then((res) => {
            if (res.status === 200) {
                if (res.result > 0) {
                    func.post('academy/questions', { year, course, type: 1, status: 1, category: 'radio', orderby: 'title_asc', limit: 3 }).then((res) => {
                        if (res.status === 200) {
                            const crs = res.result[0].course;
                            const questions = res.result;

                            this.setState({ questions }, () => {
                                this.setState({ loading: false });
                                this.props.setHeaderTitle({ h1: 'Academy', h3: `${crs.school.name} - ${crs.departments.filter(dep => dep.id === department)[0]['name']}`, p: `${crs.title}`, image: '' });
                                this.getActiveQuestion();
                            });
                        } else {
                            this.setState({ loading: false });
                            Modal.info({
                                title: 'No questions',
                                content: `This course has no questions`,
                                onOk() {
                                    self.props.history.push(`/${path[1]}/courses/${path[3]}/${path[4]}/${path[5]}/${path[6]}`);
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

    getActiveQuestion = () => {
        const { pathname, questions } = this.state;
        let correct = (func.getStorageJson(`${pathname}.academy.correct`) || []).length;
        let index = func.getStorage(`${pathname}.academy.questions.index`) || 0;
        index = parseInt(index);
        const que = questions[index] || {};
        this.setState({ que, index, correct }, () => {
            clearInterval(this.state.timeInterval);
            if ((index + 1) <= questions.length) {
                this.startTimer();
            } else {
                func.delStorage(`${this.state.pathname}.academy.elapsed`);
            }
            this.saveAnswers();
        });
    }

    pad = (val) => {
        return val > 9 ? val : '0' + val;
    }
    startTimer = () => {
        const self = this;
        const { que, pathname } = this.state;
        let duration = que.duration * 60;
        let elapsed = func.getStorage(`${pathname}.academy.elapsed`) || 0;
        elapsed = elapsed > 0 ? elapsed : 0;
        let timeInterval = setInterval(function () {
            ++elapsed;
            var hrs = self.pad(Math.floor(elapsed / 3600));
            var min = self.pad(Math.floor((elapsed - hrs * 3600) / 60));
            var sec = self.pad(elapsed - (hrs * 3600 + min * 60));
            let time = hrs + ':' + min + ':' + sec;
            self.setState({ time, timeInterval });
            func.setStorage(`${pathname}.academy.elapsed`, elapsed);
            if (elapsed >= duration) {
                clearInterval(timeInterval);
                Modal.confirm({
                    title: 'Time over',
                    content: `We are moving to the next question`,
                    okText: 'Okay',
                    onOk() {
                        self.goNext(true);
                    }
                });
            }
        }, 1000);
        this.setState({ timeInterval });
    }

    goNext = (go = false) => {
        let self = this;
        let selanswer = window.$('#answers').serializeArray();
        if (selanswer.length > 0 || go === true) {
            this.isCorrectAnswer();
            let index = func.getStorage(`${this.state.pathname}.academy.questions.index`) || 0;
            index = parseInt(index);
            func.delStorage(`${this.state.pathname}.academy.elapsed`);
            func.setStorage(`${this.state.pathname}.academy.questions.index`, index + 1);
            this.getActiveQuestion();
            window.$('#answers')[0].reset();
        } else {
            Modal.info({
                title: 'No answer',
                content: `You did not choose any answer for this question, do you wish to continue next?`,
                okText: 'Yes, Continue',
                onOk() {
                    self.goNext(true);
                }
            });
        }
    }

    isCorrectAnswer = () => {
        const { que, pathname } = this.state;
        let selanswer = window.$('#answers').serializeArray();
        if (selanswer.length > 0) {
            let value = selanswer[0].value;
            let answers = func.getStorageJson(`${pathname}.academy.answers`) || [];
            let correct = func.getStorageJson(`${pathname}.academy.correct`) || [];
            answers.push([que.id, value]);
            if (que.correct_answers.includes(value)) {
                if (correct.includes(que.id) === false) {
                    correct.push(que.id);
                }
            }
            this.setState({ correct: correct.length });
            func.setStorageJson(`${pathname}.academy.correct`, correct);
            func.setStorageJson(`${pathname}.academy.answers`, answers);
        }
    }

    saveAnswers = () => {
        const { questions, index, correct } = this.state;
        const score = Math.round((correct / questions.length) * 100);
        if (questions.length && (index + 1) > questions.length) {
            this.setState({ saved: true });
            const { school, level, department, year, course, pathname } = this.state;
            func.post('academy/saveScore', { school, level, score, department, year, course, user: this.props.auth.logg.id, answers: func.getStorageJson(`${pathname}.academy.answers`) });
        }
    }

    nextLesson = (score) => {
        const { path, pathname } = this.state;
        if (score >= 70) {
            this.props.history.push(`/${path[1]}/courses/${path[3]}/${path[4]}/${path[5]}/${path[6]}`);
        } else {
            this.setState({ saved: false }, () => {
                func.delStorage(`${pathname}.academy.correct`);
                func.delStorage(`${pathname}.academy.elapsed`);
                func.delStorage(`${pathname}.academy.questions`);
                func.delStorage(`${pathname}.academy.answers`);
                func.delStorage(`${pathname}.academy.questions.index`);
                this.getActiveQuestion();
            });
        }
    }

    render() {
        const { loading, questions, index, time, que, correct, pathname, path } = this.state;
        const current = index + 1;
        const score = Math.round((correct / questions.length) * 100);
        const correctArr = func.getStorageJson(`${pathname}.academy.correct`);
        const answersArr = func.getStorageJson(`${pathname}.academy.answers`);

        return (
            <React.Fragment>
                {loading === true && (
                    <Loading text="loading questions..." />
                )}

                {loading === false && questions.length > 0 && current <= questions.length && (
                    <div>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-style2 bg-gray-100 pd-12">
                                <li className="breadcrumb-item"><Link to="/academy">Academy</Link></li>
                                <li className="breadcrumb-item"><Link to={`/${path[1]}/intro/${path[3]}/${path[4]}/${path[5]}`}>Introduction</Link></li>
                                <li className="breadcrumb-item"><Link to={`/${path[1]}/enter/${path[3]}/${path[4]}/${path[5]}`}>Enter</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">ABC Questions {correct}</li>
                            </ol>
                        </nav>

                        <div className="row">
                            <div className="col-lg-4 col-12 mg-b-25">
                                <div className="bg-gray-200 pd-15">
                                    <p>Duration: <b>{que.duration_read}</b></p>
                                    <p>Time Elapsed: <b id="elapsed" className="text-danger">{time}</b></p>
                                    <p>Question: <b>{current}/{questions.length}</b></p>
                                </div>
                            </div>
                            <div className="col-lg-8 col-12">
                                <div className="pd-15 bg-gray-200">
                                    <div className="text-center mg-b-25">
                                        <h3>{que.title}</h3>
                                    </div>
                                    <div className="row">
                                        {que.file && (
                                            <div className="col-12 col-lg-3">

                                            </div>
                                        )}
                                        <div className={`col-12 col-lg-${que.file ? '9' : '12'}`}>
                                            <form id="answers" className="row">
                                                {que.answers.map((answer, i) => (
                                                    <div className="col-12 col-lg-6">
                                                        <label className="pointer pd-10 bg-gray-100" style={{ width: '100%' }}>
                                                            <span>
                                                                <input type={que.category} name="answers[]" value={answer} /> &nbsp; <b>{alpha[i]}.</b> {answer}
                                                            </span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center mg-t-25">
                                    <Button type="primary" onClick={() => this.goNext()}>&nbsp; &nbsp; &nbsp; &nbsp; Next &nbsp; &nbsp; &nbsp; &nbsp;</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {current > questions.length && (
                    <div>
                        <h3 className={`alert mg-b-25 text-center animated alert-${score >= 70 ? 'success' : 'danger fadeIn'}`}>Final Score: {score}%</h3>
                        <div className="mg-b-25">
                            {/* <div className="text-center">
                                <h4>Corret answers</h4>
                            </div> */}
                            <div className="mg-t-25">
                                {questions.map(que => (
                                    <p className={`pd-15 mg-b-5 alert alert-${correctArr.includes(que.id) ? 'success' : 'warning'}`}>
                                        <div className="bd-b-1">
                                            <b>Question</b>: {que.title}
                                        </div>
                                        <div>
                                            <b>Your answer</b>: {answersArr.map(ans => (ans[0] === que.id ? ans[1] : ''))}
                                        </div>
                                        <div>
                                            <b>Correct answer(s)</b>: {que.correct_answers.map(answer => (<span>{answer}</span>))}
                                        </div>
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div className="mg-t-25 text-center">
                            <Button type="primary" onClick={() => this.nextLesson(score)}>&nbsp; &nbsp; &nbsp; &nbsp; {score >= 70 ? 'Next' : 'Repeat'} Course &nbsp; &nbsp; &nbsp; &nbsp;</Button>
                        </div>
                    </div>
                )}
            </React.Fragment>
        )
    }

}

export default AcademyQuestions;