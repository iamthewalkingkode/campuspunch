import React, { Component } from 'react';
import moment from 'moment';
import { Pagination } from 'antd';
import * as func from '../../utils/functions';
import { Loading } from '../../components';
import FocMusicForm from './components/foc.music.form';
import FocMusicCard from './components/foc.music.card';
import { Link } from 'react-router-dom';

const limit = 12;
class FocMusic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            foc: {}, data: [],
            loading: true, applied: false, musicModal: false,
            interval: null,
            contest: parseInt(this.props.match.params.contest.split('.')[1]),
            step: 0, total: 0, currentStep: 1
        };
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Music Contest', description: 'Take Your First To Become A Music Superstar', keywords: 'photo contest, foc, cmpuspunch, campus photo contest' });
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });

        const { contest } = this.state;
        const { _auth: { logg } } = this.props;
        func.post('foc', { id: contest, status: 1, limit: 1 }).then(res => {
            if (res.status === 200) {
                const foc = res.result[0];
                this.setState({ foc }, () => {
                    this.props.setMetaTags({ title: foc.name, description: foc.description, keywords: 'photo contest, foc, cmpuspunch, campus photo contest' });
                    this.props.setHeaderBottom({ h1: foc.name, h3: foc.description, p: `Contest starts ${moment(foc.apply_start).format('MMM DD YYYY')}`, image: foc.image_link });
                    this.getMusics();
                    if (logg.id) {
                        func.post('foc/users', { user: logg.id, contest }).then(usr => {
                            if (usr.status === 200) {
                                this.setState({ applied: true });
                            }
                        });
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        this.setState({ loading: false });
                    }
                });
            }
        });
    }

    getMusics = () => {
        const { step, contest } = this.state;
        const { _auth: { logg } } = this.props;
        func.post('foc/musics', { contest, voter: logg.id, status: 1, limit: `${step},${limit}` }).then(res => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.setState({ loading: false });
            if (res.status === 200) {
                this.setState({ data: res.result, total: res.count });
            }
        });
    }

    nextPrev = (e) => {
        this.setState({ currentStep: e, step: (e - 1) * limit }, () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.getMusics();
        });
    }

    open = () => {
        const { foc } = this.state;
        const { _auth: { logg } } = this.props;
        this.props.history.push(`/face-of-campus/music/${foc.slug}.${foc.id}/${logg.username}.${logg.id}`);
    }

    render() {
        const { data, foc, loading, applied, musicModal, contest, total, currentStep } = this.state;

        return (
            <React.Fragment>
                {loading === true && (<Loading text="loading contest..." />)}

                {loading === false && (
                    <div>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-style2 bg-gray-100 pd-12">
                                <li className="breadcrumb-item"><Link to="/face-of-campus">Face of campus</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">{foc.name}</li>
                            </ol>
                        </nav>

                        <div className="text-center mg-b-50 mg-t-20">
                            <div className="mg-b-50">
                                {foc.canapply === true && applied === false && (
                                    <span className="btn btn-primary pointer" onClick={() => this.setState({ musicModal: true })}>&nbsp; &nbsp; &nbsp; Submit Song &nbsp; &nbsp; &nbsp;</span>
                                )}
                                {applied === true && (
                                    <span className="btn btn-primary pointer mg-l-15" onClick={this.open}>&nbsp; &nbsp; &nbsp; View my profile &nbsp; &nbsp; &nbsp;</span>
                                )}
                            </div>
                            <h3>Hey! What song do you want to vote for?</h3>
                        </div>

                        <div className="row">
                            {data.map(row => (
                                <FocMusicCard {...this.props} row={row} />
                            ))}
                        </div>

                        {total > limit && !loading && (<Pagination total={total} pageSize={limit} current={currentStep} onChange={(e) => this.nextPrev(e)} />)}

                        <FocMusicForm {...this.props} visible={musicModal} contest={contest} row={{}} onCancel={() => this.setState({ musicModal: false })} />
                    </div>
                )}
            </React.Fragment>
        )
    }

}

export default FocMusic;