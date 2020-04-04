import React, { Component } from 'react';
import moment from 'moment';
import * as func from '../../utils/functions';
import { Link } from 'react-router-dom';
import { Loading } from '../../components';

class FocPhoto extends Component {

    constructor(props) {
        super(props);
        this.state = {
            row: {}, cd: { d: '0', h: '0', m: '0', s: '0' }, data: [],
            loading: true, applied: false,
            interval: null
        };
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Photogenic Contest', description: 'Share Your Pics & Win', keywords: 'photo contest, foc, cmpuspunch, campus photo contest' });
        this.props.setHeaderTitle({ h1: '', h3: '', p: '', image: '' });

        const { id } = this.props.match.params;
        const { auth: { logg } } = this.props;
        func.post('foc', { id: parseInt(id), status: 1, limit: 1 }).then(foc => {
            if (foc.status === 200) {
                let row = foc.result[0];
                this.setState({ row });
                func.post('foc/photoschool').then(sch => {
                    if (sch.status === 200) {
                        this.setState({ data: sch.result });

                        func.post('foc/users', { user: logg.id, constest: parseInt(id) }).then(usr => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            this.setState({ loading: false });
                            this.props.setMetaTags({ title: row.name, description: row.description, keywords: 'photo contest, foc, cmpuspunch, campus photo contest' });
                            this.props.setHeaderTitle({ h1: row.name, h3: row.description, p: 'Jambites | Students | Graduates', image: 'foc/photo-home.jpg' });
                            if (row.canapply === true) {
                                this.countDown();
                                let interval = setInterval(() => {
                                    this.countDown(interval);
                                }, 4000);
                            }
                            if (usr.status === 200) {
                                this.setState({ applied: true });
                            }
                        });
                    }
                });
            }
        });
    }

    countDown(interval) {
        const { row, applied } = this.state;
        if (applied === false) {
            func.post('settings/countdown', { to: row.apply_end }).then(res => {
                this.setState({ cd: res.result, interval });
            });
        } else {
            clearInterval(this.state.interval);
        }
    }

    render() {
        const { data, row, loading, applied, cd } = this.state;

        return (
            <React.Fragment>
                {loading === true && (<Loading text="loading contest ..." />)}

                {loading === false && (
                    <div style={{ minHeight: 550 }}>
                        <div className="text-center mg-b-35 mg-t-10">
                            <h3>Application starts on {moment(row.apply_start).format('DD/MM/YY')} and ends on {moment(row.apply_end).format('DD/MM/YY')}</h3>
                            <h3>Voting starts on {moment(row.vote_start).format('DD/MM/YY')} and ends on {moment(row.vote_end).format('DD/MM/YY')}</h3>
                            {applied === false && (
                                <div>
                                    <p>You have <b className="text-danger">{cd.d}:{cd.h}:{cd.m}:{cd.s}</b> left to book your early entry</p>
                                    <span className="btn btn-xs btn-primary pointer">&nbsp; &nbsp; &nbsp; Apply &nbsp; &nbsp; &nbsp;</span>
                                </div>
                            )}
                        </div>

                        <div className="row">
                            {Object.keys(data).map(school => (
                                <div className="col-12 col-sm-4 col-lg-4">
                                    <Link to={`/face-of-campus/photo/school/${school}/${data[school][0].user.school.id}/${data[school][0].contest.id}`} key={school}>
                                        <div className="bg-gray-100 pd-20 mg-b-25">
                                            <div className="text-center text-uppercase mg-b-15"><b>{school}</b></div>
                                            <div className="img-group">
                                                {data[school].map(row => (
                                                    <img src={row.user.avatar_link} alt={row.user.fullname} className="img wd-100 ht-100 rounded-circle" />
                                                ))}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </React.Fragment>
        )
    }

}

export default FocPhoto;