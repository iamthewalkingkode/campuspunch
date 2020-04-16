import React, { Component } from 'react';
// import { Button, message } from 'antd';
import * as func from '../../utils/functions';
import { Loading } from '../../components';
import FocPhotoProfileCard from './components/foc.photo.profile.card';
import { Link } from 'react-router-dom';

class FocPhotoProfiles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [], foc: {},
            loading: true,
            school: parseInt(this.props.match.params.school.split('.')[1]),
            contest: parseInt(this.props.match.params.contest.split('.')[1])
        };
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Photogenic Contest', description: 'Share Your Pics & Win', keywords: 'photo contest, foc, campuspunch, campus photo contest' });
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });

        const { school, contest } = this.state;
        func.post('foc', { id: parseInt(contest), status: 1, limit: 1 }).then(res => {
            if (res.status === 200) {
                let foc = res.result[0];
                this.setState({ foc });
                this.props.setMetaTags({ title: foc.name, description: foc.description, keywords: 'photo contest, foc, campuspunch, campus photo contest' });
                func.post('foc/users', { school, contest, voter: this.props._auth.logg.id }).then(res => {
                    this.setState({ loading: false });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    if (res.status === 200) {
                        this.setState({ data: res.result });
                        this.props.setHeaderBottom({ h1: foc.name, h3: res.result[0].school.name, p: '', image: 'foc/photo-home.jpg' });
                    } else {

                    }
                });
            } else {
                this.setState({ loading: false });
            }
        });
    }

    render() {
        const { data, loading, foc } = this.state;
        const row = data[0] || '';

        return (
            <React.Fragment>
                {loading === true && (<Loading text="loading profiles ..." />)}

                {loading === false && (
                    <div>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-style2 bg-gray-100 pd-12">
                                <li className="breadcrumb-item"><Link to="/face-of-campus">Face of campus</Link></li>
                                <li className="breadcrumb-item"><Link to={`/face-of-campus/photo/${foc.slug}.${foc.id}`}>{foc.name}</Link></li>
                                <li className="breadcrumb-item active">{(row.school || '').name}</li>
                            </ol>
                        </nav>

                        <div className="card-columns">
                            {data.map(row => (<FocPhotoProfileCard key={row.id} row={row} {...this.props} />))}
                        </div>
                    </div>
                )}
            </React.Fragment>
        )
    }

}

export default FocPhotoProfiles;