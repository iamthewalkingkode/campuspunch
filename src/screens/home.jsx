import React, { Component } from 'react';
import * as func from '../utils/functions';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import { Loading, Advert } from '../components';
import SideBar from '../partials/Sidebar';

class HomeScreen extends Component {

    state = {
        data: {},
        loading: true
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Campus Most Entertaining Student Community', description: 'Our Mission is to create a community that gives students the medium to fully express themselves, gain a sense of belonging and get access to opportunities around the world to succeed in their career.', keywords: '' });
        this.setState({ loading: true });
        func.post('posts/home', { limit: 5 }).then(res => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.setState({ loading: false });
            if (res.status === 200) {
                this.setState({ data: res.result });
            }
        });
    }

    render() {
        const { _data: { newsCategories } } = this.props;
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
                                    <HomeCard key={ctg.id} ctg={ctg} data={data} />
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
    const { ctg, data, key } = props;
    let main = ((data[ctg.id] || [])[0] || {});

    return (
        <React.Fragment>
            {main.user && (
                <div key={key}>
                    <div className="bg-gray-100">
                        <div className="">
                            <div className="row">
                                <div className="col-12 col-lg-7">
                                    <div style={{ backgroundImage: `url(${main.image_link})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', height: isMobile ? 200 : 300 }}></div>
                                </div>
                                <div className="col-12 col-lg-5">
                                    <div className="bg-gray-100" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                        <div className="pd-20">
                                            <h3 style={{ textTransform: 'capitalize' }}>
                                                <Link to={`/article/${main.slug}.${main.id}`} className="tx-30 tx-inverse tx-semibold mg-b-0">{main.title.toLowerCase()}</Link>
                                            </h3>
                                            <div>&nbsp;</div>
                                            <div className="tx-semibold">
                                                By <Link className="tx-inverse" to={`/u/${main.user.username}`}>{main.user.username}</Link>&nbsp; • &nbsp;
                                                <Link className="tx-inverse" to={`/news/${ctg.id}`}>{ctg.name}</Link></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p>&nbsp;</p>
                    <div className="row">
                        {(data[ctg.id] || []).map((row, i) => (
                            i > 0 && (
                                <div className="col-lg-4 col-12 mg-b-10">
                                    <div
                                        style={{ backgroundImage: `url(${row.image_link})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', height: 200 }}
                                    />
                                    <div className="pd-20 bg-gray-100">
                                        <h4 className="ht-80 overflow-hidden"><Link className="tx-inverse" style={{ textTransform: 'capitalize' }} to={`/article/${row.slug}.${row.id}`}>{row.title.toLowerCase()}</Link></h4>
                                        {row.anonymous === 0 && (
                                            <span>
                                                <Link className="tx-inverse small" to={`/u/${row.user.username}`}><i className="fa fa-user"></i> {row.user.username}</Link>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                </div>
            )}
        </React.Fragment>
    );
};