import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Comments, Loading } from '../../components';
import * as func from '../../utils/functions';
import { Button } from 'antd';
import AcademyUsers from './components/academy.users';

class AcademyBuddy extends Component {

    state = {
        loading: true, usersModal: false,
        courses: [], buddies: [],
        pathname: 'xxl',
        path: this.props.location.pathname.split('/'),
        level: parseInt(this.props.match.params.level.split('.')[1]),
        buddy: parseInt((this.props.match.params.buddy || '.0').split('.')[1]),
        school: parseInt(this.props.match.params.school.split('.')[1]),
        department: parseInt(this.props.match.params.department.split('.')[1])
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Academy', description: '', keywords: '' });
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });
    }

    componentDidUpdate() {
        const { pathname } = this.state;
        if (pathname !== this.props.location.pathname) {
            this.getBuddies();
        }
    }

    getBuddies = () => {
        const { department, level } = this.state;
        this.setState({ pathname: this.props.location.pathname, buddy: parseInt((this.props.match.params.buddy || '.0').split('.')[1]) }, () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });

            func.post('academy/buddies', { status: 1, level, department, user: this.props._auth.logg.id }).then((res) => {
                this.setState({ loading: false });
                this.props.setHeaderBottom({ h1: 'Academy', h3: '', p: 'Study Buddy', image: 'banner/academy.png' });
                if (res.status === 200) {
                    this.setState({ buddies: res.result });
                }
            });
        });
    }

    render() {
        const { _data: { settings } } = this.props;
        const { school, department, level, path, loading, buddy, buddies } = this.state;
        let pathname = `/${path[1]}/buddy/${path[3]}/${path[4]}/${path[5]}`;

        return (
            <React.Fragment>
                {loading === true && (<Loading text="loading buddies..." />)}

                {loading === false && (
                    <div style={{ minHeight: 550 }}>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-style2 bg-gray-100 pd-12">
                                <li className="breadcrumb-item"><Link to="/academy">Academy</Link></li>
                                <li className="breadcrumb-item"><Link to={`/${path[1]}/intro/${path[3]}/${path[4]}/${path[5]}`}>Introduction</Link></li>
                                <li className="breadcrumb-item"><Link to={`/${path[1]}/enter/${path[3]}/${path[4]}/${path[5]}`}>Academy</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Study Buddy</li>
                            </ol>
                        </nav>

                        {buddies.length > 0 && (
                            <div className="row">
                                <div className="col-lg-4 col-12">
                                    <div className="list-group mg-b-25">
                                        {buddies.map(row => (
                                            <div className={`list-group-item d-flex align-items-centers pointer ${buddy === row.buddy.id ? 'bg-gray-100' : ''}`} onClick={() => {
                                                if (buddy !== row.buddy.id) {
                                                    this.setState({ buddy: 0 }, () => {
                                                        this.props.history.push(`${pathname}/${row.buddy.username}.${row.buddy.id}`);
                                                    });
                                                }
                                            }}>
                                                <img src={row.buddy.avatar_link} className="wd-30 ht-30 rounded-circle mg-r-15" alt={row.buddy.username} />
                                                <div>
                                                    <h6 className="tx-inverse tx-semibold mg-b-0">{row.buddy.fullname}</h6>
                                                    <span className="d-block text-muted">@{row.buddy.username}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {(buddies.length < settings.academy_buddy_limit) && (
                                            <Button type="primary" className="mg-t-20" block onClick={() => this.setState({ usersModal: true })}>Add a Study Buddy</Button>
                                        )}
                                    </div>
                                </div>
                                <div className="col-lg-8 col-12">
                                    {buddy > 0 && (
                                        <div className="pd-15 bg-gray-100" style={{ minHeight: 550 }}>
                                            <Comments item={`${school}-${department}-${level}-${buddy}`} type="buddy" {...this.props} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {buddies.length === 0 && (
                            <div className="d-flex flex-column align-items-center justify-content-center mg-t-100">
                                <div className="wd-100 mg-b-15"><img src="/assets/img/academy/buddy.png" className="img-fluid" alt="No Buddies" /></div>
                                <h1 className="tx-color-01 tx-24 tx-sm-24 tx-lg-24 mg-xl-b-5">You have no study buddy</h1>
                                <p className="tx-color-03 mg-b-30">You can add a studdy buddy by clicking the button bellow</p>
                                <div className="text-center">
                                    <Button type="primary" onClick={() => this.setState({ usersModal: true })}>Find Study Buddies</Button>
                                </div>
                            </div>
                        )}

                        <AcademyUsers {...this.state} {...this.props} visible={this.state.usersModal} onOk={() => this.getBuddies()} onCancel={() => this.setState({ usersModal: false })} />

                    </div>
                )}

                {buddy > 0 && (
                    <div className="init___insta___chat hide">
                        <i className="fa fa-whatsapp"></i> Initiate Instant Chat
                    </div>
                )}
            </React.Fragment>
        )
    }

}

export default AcademyBuddy;