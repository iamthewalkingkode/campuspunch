import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as func from '../../utils/functions';

class FocScreen extends Component {

    state = {
        partners: [],
        loading: true
    }

    componentDidMount() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.props.setMetaTags({ title: 'Face Of Campus - Official Site of FOC', description: 'Face Of Campus - Official Site of FOC', keywords: '' });
        this.props.setHeaderBottom({ h1: 'Face of Campus', h3: 'Become Famous, Rich & Admired', p: 'Jambites | Students | Graduates', image: 'foc/foc-home.jpg' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });

        func.post('partners', { status: 1 }).then(res => {
            if (res.status === 200) {
                this.setState({ partners: res.result });
            }
        });
    }

    render() {
        const { _data: { focContests } } = this.props;

        return (
            <React.Fragment>
                <div className="text-center mg-b-35 mg-t-10">
                    <h2>What contest are you applying for?</h2>
                    <p>You have 00:15:45 left to book your early entry</p>
                </div>

                <div className="row">
                    {focContests.map(row => (
                        <div className="col-12 col-sm-4 col-lg-4">
                            <Link key={row.id} className="card mg-b-25" to={`/face-of-campus/${row.type}/${row.slug}.${row.id}`}>
                                <img src={row.image_link} className="card-img-top" alt={row.name} />
                                <div className="card-body text-center">
                                    <h6 className="card-title">{row.name}</h6>
                                    <p className="card-text text-muted">{row.description}</p>
                                </div>
                                {row.canapply === true && ['photos'].includes(row.type) && (
                                    <div className="card-footer d-flex">
                                        <Link to={`/face-of-campus/${row.type}/${row.slug}.${row.id}/apply`} className="btn btn-xs btn-primary pointer flex-fill mg-r-25">Apply</Link>
                                    </div>
                                )}
                            </Link>
                        </div>
                    ))}
                </div>

                <section className="mg-t-50 mg-b-50">
                    <div className="text-center">
                        <h3 className="mg-b-0">Partners</h3>
                    </div>
                    <div className="row mg-t-30">
                        {this.state.partners.map(pat => (
                            <div className="col-6 col-lg-2 text-center">
                                <a href={pat.link} target="_blank" rel="noopener noreferrer">
                                    <img src={pat.logo_link} alt={pat.name} className="img-fluid" />
                                    <div>{pat.name}</div>
                                </a>
                            </div>
                        ))}
                    </div>
                </section>
            </React.Fragment>
        )
    }

}

export default FocScreen;