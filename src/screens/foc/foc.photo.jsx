import React, { Component } from 'react';
import moment from 'moment';
import * as func from '../../utils/functions';
import { Loading, Empty } from '../../components';
import FocPhotoSchool from './components/foc.photo.school';
import { Link } from 'react-router-dom';
import FocPhotoForm from './components/foc.photo.form';

class FocPhoto extends Component {

    constructor(props) {
        super(props);
        this.state = {
            row: {}, cd: { d: '0', h: '0', m: '0', s: '0' }, data: [],
            loading: true, applied: false, voting: false, formModal: false,
            interval: null,
            contest: parseInt(this.props.match.params.contest.split('.')[1])
        };
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Face Of Campus Photogenic Contest', description: 'Share your pics and win N2 million', keywords: 'photo contest, foc, cmpuspunch, campus photo contest' });
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });

        const { contest } = this.state;
        const { _auth: { logg } } = this.props;
        func.post('foc', { id: contest, status: 1, limit: 1 }).then(foc => {
            if (foc.status === 200) {
                let row = foc.result[0];
                this.setState({ row });
                func.post('foc/photoschool', { contest, voter: logg.id }).then(sch => {
                    if (sch.status === 200) {
                        this.setState({ data: sch.result });
                    }
                });
                if (logg.id) {
                    func.post('foc/users', { user: logg.id, contest }).then(usr => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        this.setState({ loading: false });
                        this.props.setMetaTags({ title: row.name, description: row.description, keywords: 'photo contest, foc, cmpuspunch, campus photo contest' });
                        this.props.setHeaderBottom({ h1: row.name, h3: row.description, p: 'Jambites | Students | Graduates', image: row.image_link });
                        // if (row.canapply === true) {
                        //     this.countDown();
                        //     let interval = setInterval(() => {
                        //         this.countDown(interval);
                        //     }, 4000);
                        // }
                        if (usr.status === 200) {
                            this.setState({ applied: true });
                        }
                    });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.setState({ loading: false });
                }
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

    open = () => {
        const { row } = this.state;
        const { _auth: { logg } } = this.props;
        this.props.history.push(`/face-of-campus/photo/profile/${row.slug}.${row.id}/${logg.username}.${logg.id}`);
    }

    render() {
        const { data, row, loading, applied, formModal } = this.state;

        return (
            <React.Fragment>
                {loading === true && (<Loading text="loading contest ..." />)}

                {loading === false && (
                    <section>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-style2 bg-gray-100 pd-12">
                                <li className="breadcrumb-item"><Link to="/face-of-campus">Face of campus</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">{row.name}</li>
                            </ol>
                        </nav>

                        <div className="text-center mg-b-50 mg-t-20">
                            {/* <h3>Application starts on {moment(row.apply_start).format('DD/MM/YY')} and ends on {moment(row.apply_end).format('DD/MM/YY')}</h3>
                            <h3>Voting starts on {moment(row.vote_start).format('DD/MM/YY')} and ends on {moment(row.vote_end).format('DD/MM/YY')}</h3> */}
                            <div className="mg-b-50">
                                {row.canapply === true && applied === false && (
                                    <span className="btn btn-primary pointer" onClick={() => this.setState({ formModal: true })}>&nbsp; &nbsp; &nbsp; Submit Profile &nbsp; &nbsp; &nbsp;</span>
                                )}
                                {applied === true && (
                                    <span className="btn btn-primary pointer mg-l-15" onClick={this.open}>&nbsp; &nbsp; &nbsp; View my profile &nbsp; &nbsp; &nbsp;</span>
                                )}
                            </div>
                        </div>

                        <div className="row">
                            {Object.keys(data).map(school => (
                                <FocPhotoSchool {...this.props} key={school} data={data} school={school} row={data[school][0]} />
                            ))}
                        </div>

                        <FocPhotoForm {...this.props} visible={formModal} row={{}} onCancel={() => this.setState({ formModal: false })} />
                    </section>
                )}

                {loading === false && data.length === 0 && (
                    <Empty h1="No contestants" h5="No contestants have applied for this contest yet. Be the first!" />
                )}
            </React.Fragment>
        )
    }

}

export default FocPhoto;