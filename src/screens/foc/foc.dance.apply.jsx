import React, { Component } from 'react';
import * as func from '../../utils/functions';
import { Link } from 'react-router-dom';
import { Loading } from '../../components';

class FocDanceApply extends Component {

    constructor(props) {
        super(props);
        this.state = {
            row: {}, loading: true,
            contest: parseInt(this.props.match.params.contest.split('.')[1])
        };
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Dance Contest', description: 'It\'s time for the world to see your dance moves', keywords: 'photo contest, foc, campuspunch, campus photo contest' });
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });

        const { contest } = this.state;
        func.post('foc', { id: contest, status: 1 }).then(res => {
            if (res.status === 200) {
                const foc = res.result[0];
                this.setState({ foc });
                this.props.setMetaTags({ title: foc.name, description: foc.description, keywords: 'photo contest, foc, campuspunch, campus photo contest' });
                this.props.setHeaderBottom({ h1: foc.name, h3: foc.description, p: '', image: foc.image_link });
            }
            this.setState({ loading: false });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    render() {
        const { _data: { settings }, _auth: { logg } } = this.props;
        const { loading, foc } = this.state;

        return (
            <React.Fragment>
                {loading === true && (<Loading text="applying to contest ..." />)}

                {loading === false && (
                    <div>
                        <div className="card tx-whites bg-successs text-center mg-b-35 mg-t-10">
                            <div className="card-header tx-semibold"><h2 className="tx-whites">CONGRATULATIONS</h2></div>
                            <div className="card-body tx-whites" dangerouslySetInnerHTML={{ __html: settings.foc_dance_apply }} />

                            <Link to={`/face-of-campus/dance/${foc.slug}.${foc.id}/${logg.username}.${logg.id}`} className="btn btn-primary">Go to my profile</Link>
                        </div>
                    </div>
                )}
            </React.Fragment>
        )
    }

}

export default FocDanceApply;