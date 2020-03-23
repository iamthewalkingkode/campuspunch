import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as func from '../../utils/functions';
import { PayModal, Loading } from '../../components';
import { Modal } from 'antd';

const cards = [
    { icon: 'abc', name: 'ABC Questions', link: 'abc-questions' },
    // { icon: 'theory', name: 'Theory Questions', link: 'theory-questions' },
    { icon: 'lessons', name: 'Lessons', link: 'lessons' },
    { icon: 'chat', name: 'Lecturer\'s chat', link: 'chat' },
    { icon: 'resources', name: 'Resources', link: 'resources' }
];

class AcademyEnter extends Component {

    state = {
        loading: true, payVisible: false, planVisible: false, yearsVisible: false,
        courses: [], card: {}, years: [], payAmount: 0, ipaid: 0,
        level: parseInt(this.props.match.params.level.split('.')[1]),
        school: parseInt(this.props.match.params.school.split('.')[1]),
        department: parseInt(this.props.match.params.department.split('.')[1])
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Academy', description: '', keywords: '' });
        this.props.setHeaderTitle({ h1: '', h3: '', p: '', image: '' });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        const { department, level, school } = this.state;

        func.post('academy/payments_total', { department, level, user: this.props.auth.logg.id }).then((res) => {
            if (res.status === 200) {
                this.setState({ ipaid: res.result });
                func.post('academy/courses', { department, lessons: 'yes' }).then((res) => {
                    this.setState({ loading: false });
                    if (res.status === 200) {
                        let crs = res.result[0];
                        this.props.setHeaderTitle({ h1: 'Academy', h3: `${crs.school.name} - ${crs.departments.filter(dep => dep.id === department)[0]['name']}`, p: 'Introduction', image: '' });
                        this.setState({ courses: res.result });
                    } else {
                        this.setState({ courses: [] });
                    }
                });
                func.post('academy/years', { level, school, type: 1 }).then((res) => {
                    if (res.status === 200) {
                        this.setState({ years: res.result });
                    }
                });
            }
        });
    }

    startCourse = (card) => {
        this.setState({ card }, () => {
            const { ipaid } = this.state;
            const { history, location: { pathname } } = this.props;

            if (ipaid >= 200) {
                if (ipaid < 3000) {
                    if (func.inArray(card.icon, ['abc']) === true) {
                        this.setState({ yearsVisible: true });
                    } else {
                        this.setState({ planVisible: true });
                    }
                } else {
                    switch (card.icon) {
                        default:
                            this.setState({ yearsVisible: true });
                            break;
                        case 'chat':
                            history.push(`${pathname.split('enter').join('chat')}`);
                            break;
                        case 'lessons':
                            history.push(`${pathname.split('enter').join('lessons')}`);
                            break;
                        case 'resources':
                            history.push(`${pathname.split('enter').join('ressources')}`);
                            break;
                    }
                }
            } else {
                this.setState({ planVisible: true });
            }
        });
    }

    enteCourses = (year) => {
        this.props.history.push(`${this.props.location.pathname.split('enter').join('courses')}/${year}`);
    }

    render() {
        const { payAmount, payVisible, planVisible, yearsVisible, department, level, years, loading, ipaid } = this.state;

        return (
            <React.Fragment>
                {loading === true && (
                    <Loading text="checking subscription..." />
                )}

                {loading === false && (
                    <div>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-style2 bg-gray-100 pd-12">
                                <li className="breadcrumb-item"><Link to="/academy">Academy</Link></li>
                                <li className="breadcrumb-item"><Link to={`${this.props.location.pathname.split('enter').join('intro')}`}>Introduction</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Data</li>
                            </ol>
                        </nav>

                        <div className="mg-t-25">
                            <div className="row">
                                {cards.map(card => (
                                    <div key={card.icon} className="col-12 col-lg-4">
                                        <div className="card mg-b-20 text-center pointer" onClick={() => this.startCourse(card)}>
                                            <div className="card-body">
                                                <p><img src={`/assets/img/academy/${card.icon}.png`} className="img-thumbnails" alt={card.name} style={{ maxWidth: '20%' }} /></p>
                                                <p><b className="pointer" style={{ color: '#202020' }}>{card.name}</b></p>
                                                <p style={{ color: '#666' }}>Small description goes here</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Modal title="Complete your payment" visible={planVisible} onCancel={() => this.setState({ planVisible: false })} footer={null}>
                            <div className="pointer pd-12" onClick={() => this.setState({ payVisible: true, payAmount: 3000, planVisible: false })} style={{ background: '#e5e9f2' }}>
                                Video Lessons + Personal Tutor: <b className="text-primary">₦3000</b>
                            </div>
                        </Modal>

                        <Modal title="Choose a year to continue" visible={yearsVisible} onCancel={() => this.setState({ yearsVisible: false })} footer={null}>
                            <div className="row">
                                {years.map(yr => (
                                    <div className="col-4">
                                        <div className="pointer pd-6 bg-gray-100 mg-b-15 text-center" onClick={() => this.enteCourses(yr.year)}>
                                            {yr.year}
                                        </div>
                                    </div>
                                ))}
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
                            paySuccess={(e) => {
                                this.setState({ planVisible: false, ipaid: ipaid + payAmount });
                                setTimeout(() => {
                                    this.startCourse(this.state.card);
                                }, 100);
                            }}
                        />
                    </div>
                )}
            </React.Fragment>
        )
    }

}

export default AcademyEnter;