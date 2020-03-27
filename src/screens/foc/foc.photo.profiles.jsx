import React, { Component } from 'react';
// import { Button, message } from 'antd';
import * as func from '../../utils/functions';
import { Loading } from '../../components';
import FocPhotoProfileCard from './foc.photo.profile.card';

class FocPhotoProfiles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            row: {}, data: [],
            loading: true
        };
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Photogenic Contest', description: 'Share Your Pics & Win', keywords: 'photo contest, foc, cmpuspunch, campus photo contest' });
        this.props.setHeaderTitle({ h1: '', h3: '', p: '', image: '' });

        const { school, contest } = this.props.match.params;
        func.post('foc', { id: parseInt(contest), status: 1, limit: 1 }).then(res => {
            if (res.status === 200) {
                let row = res.result[0];
                this.setState({ row });
                this.props.setMetaTags({ title: row.name, description: row.description, keywords: 'photo contest, foc, cmpuspunch, campus photo contest' });
                func.post('foc/users', { school: parseInt(school), contest: parseInt(contest), voter: this.props.auth.logg.id }).then(res => {
                    this.setState({ loading: false });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    if (res.status === 200) {
                        this.setState({ data: res.result });
                        this.props.setHeaderTitle({ h1: row.name, h3: res.result[0].school.name, p: '', image: 'foc/photo-home.jpg' });
                    } else {

                    }
                });
            } else {
                this.setState({ loading: false });
            }
        });
    }

    render() {
        const { data, loading } = this.state;

        return (
            <React.Fragment>
                {loading === true && (<Loading text="loading profiles ..." />)}

                {loading === false && (
                    <div>
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