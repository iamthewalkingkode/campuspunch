import React, { Component } from 'react';
// import { Form, Input, Button, message } from 'antd';
import * as func from '../utils/functions';
import { Link } from 'react-router-dom';

import { Loading, Advert } from '../components';
import SideBar from '../partials/sidebar';
// import moment from 'moment';

class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            loading: true
        };
    }

    componentDidMount() {
        // this.props.setMetaTags({ title: '' });
        this.setState({ loading: true });
        func.post('posts/home', { limit: 9 }).then(res => {
            this.setState({ loading: false });
            if (res.status === 200) {
                this.setState({ data: res.result });
            }
        });
    }

    render() {
        const { utils: { newsCategories } } = this.props;
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
                        <Advert type="top" />

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
        <div className="bd-1 mg-b-30">
            <h6 className="tx-uppercase tx-semibold mg-b-0">Campus {ctg.name}</h6>
            <div className="list-group">
                <span className="list-group-item d-flex align-items-center bd-0 pd-0">
                    <div className="mg-r-20" style={{ background: `url(${main.image_link})`, width: '40rem', height: 100, backgroundSize: 'cover', backgroundPosition: 'center', }}></div>
                    <div>
                        <Link to={`/${main.slug}/${main.id}`} className="tx-20 tx-inverse tx-semibold mg-b-0">{main.title}</Link>
                        <p className="d-block tx-13 text-muted">{main.content_small} ...</p>
                    </div>
                </span>
            </div>
            <ul className="list-group">
                {(data[ctg.id] || []).map((row, i) => (
                    i > 1 && (
                        <li className="list-group-item bd-0 pd-0"><Link to={`/article/${row.slug}/${row.id}`}>{row.title}</Link></li>
                    )
                ))}
            </ul>
        </div>
    );
};