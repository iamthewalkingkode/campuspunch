import React, { Component } from 'react';
import * as func from '../utils/functions';
import { Link } from 'react-router-dom';

import { Loading, Advert } from '../components';
import SideBar from '../partials/Sidebar';

class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            loading: true
        };
    }

    componentDidMount() {
        this.props.setMetaTags({ title: '', description: '', keywords: '' });
        this.setState({ loading: true });
        func.post('posts/home', { limit: 9 }).then(res => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.setState({ loading: false });
            if (res.status === 200) {
                this.setState({ data: res.result });
            }
        });
    }

    render() {
        const { data: { newsCategories } } = this.props;
        const { loading, data } = this.state;

        return (
            <React.Fragment>
                {loading === true && (<Loading text={`loading posts...`} />)}

                {(loading === false) && (
                    <div className="mg-b-30">
                        {/* <div className="mg-b-30">
                            <Link to={`/face-of-campus`}>
                                <img className="img-thumbnail no" src="https://campuspunch.com/assets/slides/slide5.jpg" alt="Face of Campus - CampusPunch" />
                            </Link>
                        </div> */}
                        <Advert position="top" />

                        <div className="row">
                            <div className="col-12 col-sm-9 col-lg-9">
                                {newsCategories.map(ctg => (
                                    <HomeCard key={ctg.code} ctg={ctg} data={data} />
                                ))}
                            </div>

                            <div className="col-12 col-sm-3 col-lg-3">
                                <SideBar {...this.props} />
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        )
    }

}

export default HomeScreen;


const HomeCard = props => {
    const { ctg, data } = props;
    let main = ((data[ctg.id] || [])[0] || {});

    return (
        <div className="card mg-b-25">
            <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between bg-gray-100">
                <h6 className="tx-uppercase tx-semibold mg-b-0">Campus {ctg.name}</h6>
            </div>
            <div className="card-body">
                <div className="">
                    {main.id && (
                        <div className="row row-sm">
                            <div className="col-12 col-lg-4">
                                <img className="img-fluid" src={main.image_link} alt={`${main.title} - CampusPunch`} />
                            </div>
                            <div className="col-12 col-lg-8">
                                <Link to={`/article/${main.slug}/${main.id}`} className="tx-20 tx-inverse tx-semibold mg-b-0">{main.title}</Link>
                                <p className="d-block tx-13 text-muteds">{main.content_small} ...</p>
                            </div>
                        </div>
                    )}
                    <ul className="list-group">
                        {(data[ctg.id] || []).map((row, i) => (
                            i > 1 && (
                                <li className="list-group-item bd-0 pd-0 mg-b-5">
                                    <Link to={`/article/${row.slug}/${row.id}`}>{row.title}</Link>{' '} | {' '}
                                    <Link to={`/u/${row.user.username}`}><i className="fa fa-user"></i> {row.user.username}</Link>
                                </li>
                            )
                        ))}
                    </ul>
                    <Link to={`/news/${ctg.id}`} className="btn btn-outline-primary mg-t-20">More {ctg.name}</Link>
                </div>
            </div>
        </div>
    );
};