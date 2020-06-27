import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from 'antd';

import * as func from '../../utils/functions';
import { Loading, Empty } from '../../components';
import FocDanceCard from './components/foc.dance.card';
import FocDanceForm from './components/foc.dance.form';

const limit = 12;
class FocDance extends Component {

    constructor(props) {
        super(props);
        this.state = {
            foc: {}, data: [],
            loading: true, applied: false, formModal: false,
            interval: null,
            contest: parseInt(this.props.match.params.contest.split('.')[1]),
            step: 0, total: 0, currentStep: 1
        };
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Face Of Campus Dance Contest', description: 'It\'s time for the world to see your dance moves', keywords: 'photo contest, foc, cmpuspunch, campus photo contest' });
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });

        const { contest } = this.state;
        const { _auth: { logg } } = this.props;
        func.post('foc', { id: contest, status: 1, limit: 1 }).then(res => {
            if (res.status === 200) {
                const foc = res.result[0];
                this.setState({ foc }, () => {
                    this.props.setMetaTags({ title: foc.name, description: foc.description, keywords: 'photo contest, foc, cmpuspunch, campus photo contest' });
                    this.props.setHeaderBottom({ h1: foc.name, h3: foc.description, p: foc.canvote ? 'Voting Started. Vote Now!' : 'Application still ongoing. Apply Now!', image: foc.image_link });
                    this.getDances();
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

    getDances = () => {
        const { step, contest } = this.state;
        const { _auth: { logg } } = this.props;
        func.post('foc/dances', { contest, voter: logg.id, status: 1, limit: `${step},${limit}` }).then(res => {
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
            this.getDances();
        });
    }

    open = () => {
        const { foc } = this.state;
        const { _auth: { logg } } = this.props;
        this.props.history.push(`/face-of-campus/dance/${foc.slug}.${foc.id}/${logg.username}.${logg.id}`);
    }

    render() {
        const { _auth: { authenticated }, history } = this.props;
        const { data, foc, loading, applied, total, currentStep, formModal } = this.state;

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
                                {((foc.canapply === true && applied === false) && authenticated) && (
                                    <span className="btn btn-primary pointer" onClick={() => this.setState({ formModal: true })}>&nbsp; &nbsp; &nbsp; Submit Video &nbsp; &nbsp; &nbsp;</span>
                                )}
                                {(!authenticated) && (
                                    <span className="btn btn-primary pointer" onClick={() => history.push(`/user/signin?redirect=${window.location.href}`)}>&nbsp; &nbsp; &nbsp; Sign in to Submit Video &nbsp; &nbsp; &nbsp;</span>
                                )}
                                {applied === true && authenticated === true && (
                                    <span className="btn btn-primary pointer mg-l-15" onClick={this.open}>&nbsp; &nbsp; &nbsp; View my profile &nbsp; &nbsp; &nbsp;</span>
                                )}
                            </div>
                        </div>

                        <div className="rows">
                            {data.map(row => (
                                <FocDanceCard {...this.props} row={row} />
                            ))}
                        </div>

                        {total > limit && !loading && (<Pagination total={total} pageSize={limit} current={currentStep} onChange={(e) => this.nextPrev(e)} />)}

                        <FocDanceForm {...this.props} visible={formModal} row={{}} onCancel={() => this.setState({ formModal: false })} />
                    </div>
                )}

                {loading === false && data.length === 0 && (
                    <Empty h1="No contestants" h5="No contestants have applied for this contest yet. Be the first!" />
                )}
            </React.Fragment>
        )
    }

}

export default FocDance;