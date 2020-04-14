import React, { Component } from 'react';
import moment from 'moment';
import * as func from '../../utils/functions';
import { Loading } from '../../components';
import FocPhotoSchool from './components/foc.photo.school';

class FocPhoto extends Component {

    constructor(props) {
        super(props);
        this.state = {
            row: {}, cd: { d: '0', h: '0', m: '0', s: '0' }, data: [],
            loading: true, applied: false, voting: false,
            interval: null,
            contest: parseInt(this.props.match.params.contest.split('.')[1])
        };
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Photogenic Contest', description: 'Share Your Pics & Win', keywords: 'photo contest, foc, cmpuspunch, campus photo contest' });
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });

        const { contest } = this.state;
        const { auth: { logg } } = this.props;
        func.post('foc', { id: contest, status: 1, limit: 1 }).then(foc => {
            if (foc.status === 200) {
                let row = foc.result[0];
                this.setState({ row });
                func.post('foc/photoschool', { voter: logg.id }).then(sch => {
                    if (sch.status === 200) {
                        this.setState({ data: sch.result });

                        func.post('foc/users', { user: logg.id, contest }).then(usr => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            this.setState({ loading: false });
                            this.props.setMetaTags({ title: row.name, description: row.description, keywords: 'photo contest, foc, cmpuspunch, campus photo contest' });
                            this.props.setHeaderBottom({ h1: row.name, h3: row.description, p: 'Jambites | Students | Graduates', image: 'foc/photo-home.jpg' });
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
                    <div>
                        <div className="text-center mg-b-50 mg-t-20">
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
                                <FocPhotoSchool {...this.props} key={school} data={data} school={school} row={data[school][0]} />
                            ))}
                        </div>
                    </div>
                )}
            </React.Fragment>
        )
    }

}

export default FocPhoto;