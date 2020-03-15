import React, { Component } from 'react';
import * as func from '../../utils/functions';
import { Link } from 'react-router-dom';
import { Loading } from '../../components';

class FocPhotoApply extends Component {

    constructor(props) {
        super(props);
        this.state = {
            row: {}, loading: true,
            contest: 0
        };
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Photogenic Contest', description: 'Share Your Pics & Win', keywords: 'photo contest, foc, cmpuspunch, campus photo contest' });
        this.props.setHeaderTitle({ h1: '', h3: '', p: '', image: '' });

        const { auth: { logg }, match: { params: { id } } } = this.props;
        func.post('foc/apply', { contest: parseInt(id), user: logg.id, school: logg.school.id }).then(res => {
            this.setState({ loading: false, contest: parseInt(id) });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    render() {
        const { data: { settings }, auth: { logg } } = this.props;
        const { loading, contest } = this.state;

        return (
            <React.Fragment>
                {loading === true && (<Loading text="applying to contest ..." />)}

                {loading === false && (
                    <div>
                        <div className="card tx-whites bg-successs text-center mg-b-35 mg-t-10">
                            <div class="card-header tx-semibold"><h2 className="tx-whites">CONGRATULATIONS</h2></div>
                            <div class="card-body tx-whites" dangerouslySetInnerHTML={{ __html: settings.foc_photo_apply }}></div>

                            <Link to={`/face-of-campus/photo/profile/${logg.username}/${logg.id}/${contest}`} className="btn btn-primary">Update your voting profile</Link>
                        </div>
                    </div>
                )}
            </React.Fragment>
        )
    }

}

export default FocPhotoApply;