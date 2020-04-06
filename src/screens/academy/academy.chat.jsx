import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Comments, Loading } from '../../components';
import * as func from '../../utils/functions';

class AcademyChat extends Component {

    state = {
        loading: true,
        courses: [], tutors: [],
        pathname: 'xxl',
        path: this.props.location.pathname.split('/'),
        level: parseInt(this.props.match.params.level.split('.')[1]),
        tutor: parseInt((this.props.match.params.tutor || '.0').split('.')[1]),
        school: parseInt(this.props.match.params.school.split('.')[1]),
        department: parseInt(this.props.match.params.department.split('.')[1])
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Academy', description: '', keywords: '' });
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });
    }

    componentDidUpdate() {
        const { department, level, pathname } = this.state;
        if (pathname !== this.props.location.pathname) {
            this.setState({ pathname: this.props.location.pathname, tutor: parseInt((this.props.match.params.tutor || '.0').split('.')[1]) }, () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });

                func.post('academy/tutors', { type: 1, status: 1, level, department }).then((res) => {
                    if (res.status === 200) {
                        this.setState({ loading: false });
                        this.props.setHeaderBottom({ h1: 'Academy', h3: '', p: 'Lecturer\'s chat', image: 'banner/academy.png' });
                        this.setState({ tutors: res.result });
                    }
                });
            });
        }
    }

    render() {
        const { school, department, level, path, loading, tutor, tutors } = this.state;
        let pathname = `/${path[1]}/chat/${path[3]}/${path[4]}/${path[5]}`;

        return (
            <React.Fragment>
                {loading === true && (<Loading text="loading tutors..." />)}

                {loading === false && (
                    <div style={{ minHeight: 550 }}>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-style2 bg-gray-100 pd-12">
                                <li className="breadcrumb-item"><Link to="/academy">Academy</Link></li>
                                <li className="breadcrumb-item"><Link to={`/${path[1]}/intro/${path[3]}/${path[4]}/${path[5]}`}>Introduction</Link></li>
                                <li className="breadcrumb-item"><Link to={`/${path[1]}/enter/${path[3]}/${path[4]}/${path[5]}`}>Academy</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Lecturer's chat</li>
                            </ol>
                        </nav>

                        <div className="row">
                            <div className="col-lg-4 col-12">
                                <div className="list-group mg-b-25">
                                    {tutors.map(tut => (
                                        <div class={`list-group-item d-flex align-items-centers pointer ${tutor === tut.id ? 'bg-gray-100' : ''}`} onClick={() => {
                                            if (tutor !== tut.id) {
                                                this.setState({ tutor: 0 }, () => {
                                                    this.props.history.push(`${pathname}/${tut.username}.${tut.id}`);
                                                });
                                            }
                                        }}>
                                            <img src={tut.avatar_link} class="wd-30 ht-30 rounded-circle mg-r-15" alt={tut.username} />
                                            <div>
                                                <h6 class="tx-inverse tx-semibold mg-b-0">{tut.fullname}</h6>
                                                <span class="d-block text-muted">@{tut.username}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-lg-8 col-12">
                                {tutor > 0 && (
                                    <div className="pd-15 bg-gray-100" style={{ minHeight: 550 }}>
                                        <Comments item={`${school}-${department}-${level}-${tutor}`} type="chat" {...this.props} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {tutor > 0 && (
                    <div className="init___insta___chat hide">
                        <i className="fa fa-whatsapp"></i> Initiate Instant Chat
                    </div>
                )}
            </React.Fragment>
        )
    }

}

export default AcademyChat;