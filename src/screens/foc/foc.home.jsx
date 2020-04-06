import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class FocScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            loading: true
        };
    }

    componentDidMount() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.props.setMetaTags({ title: 'Face of Campus', description: '', keywords: '' });
        this.props.setHeaderBottom({ h1: 'Face of Campus', h3: 'Become Famous, Rich & Admired', p: 'Jambites | Students | Graduates', image: 'foc/foc-home.jpg' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });
    }

    render() {
        const { data: { focContests } } = this.props;

        return (
            <React.Fragment>
                <div className="text-center mg-b-35 mg-t-10">
                    <h2>What contest are you applying for?</h2>
                    <p>You have 00:15:45 left to book your early entry</p>
                </div>

                <div className="row">
                    {focContests.map(row => (
                        <div className="col-12 col-sm-4 col-lg-4">
                            <div key={row.id} className="card mg-b-25">
                                <img src={row.image_link} className="card-img-top" alt={row.name} />
                                <div className="card-body">
                                    <h6 className="card-title">{row.name}</h6>
                                    <p className="card-text">{row.description}</p>
                                </div>
                                <div className="card-footer d-flex">
                                    {row.canapply === true && (
                                        <Link to={`/face-of-campus/${row.type}/${row.slug}/${row.id}/apply`} className="btn btn-xs btn-primary pointer flex-fill mg-r-25">Apply</Link>
                                    )}
                                    <Link to={`/face-of-campus/${row.type}/${row.slug}/${row.id}`} className="btn btn-xs btn-secondary pointer flex-fill">View</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </React.Fragment>
        )
    }

}

export default FocScreen;