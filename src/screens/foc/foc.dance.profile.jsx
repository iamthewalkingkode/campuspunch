import React, { Component } from 'react';
import { Button, message, Modal } from 'antd';
import * as func from '../../utils/functions';
import { isMobile } from 'react-device-detect';

import { Loading, Advert, Comments } from '../../components';
import NotFound from '../../partials/404';
import { Link } from 'react-router-dom';

class FocDanceProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usr: {}, foc: {}, playVideo: '',
            loading: true,
            user: parseInt(this.props.match.params.user.split('.')[1]),
            username: this.props.match.params.user.split('.')[0],
            contest: parseInt(this.props.match.params.contest.split('.')[1])
        };
    }

    componentDidMount() {
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });

        const { user, username, contest } = this.state;
        this.props.setMetaTags({ title: username, description: '', keywords: '' });
        this.setState({ loading: true });
        func.post('foc/dances', { user, contest, voter: this.props._auth.logg.id, limit: 1 }).then(res => {
            if (res.status === 200) {
                const foc = res.result[0];
                const usr = res.result[0].user;
                setTimeout(() => { window.init(); }, 200);
                this.props.setHeaderBottom({ h1: foc.contest.name, h3: '', p: foc.dance.title, image: foc.contest.image_link });
                this.props.setMetaTags({ title: foc.dance.title, description: usr.about, keywords: '' });
                this.setState({ usr, foc, loading: false });
            } else {
                this.setState({ loading: false });
            }
        });
    }

    vote = () => {
        const { user, contest, foc } = this.state;
        const { _auth: { logg, authenticated } } = this.props;
        if (authenticated === true) {
            this.props.focVote(user + contest, { contest, user, school: parseInt(foc.school.id), voter: logg.id, type: 'dance' }, (status, result) => {
                if (status === 200) {
                    this.setState({ foc: { ...foc, voted: true } });
                    message.success(result);
                } else {
                    message.error(result);
                }
            });
        } else {
            message.warning('You must sign in to place a vote');
        }
    }

    render() {
        const { loading, usr, foc, username, user, contest, playVideo } = this.state;

        return (
            <React.Fragment>
                {loading === true && (<Loading text={`loading ${username}'s profile...`} />)}
                {(loading === false && usr.id === undefined) && (<NotFound {...this.props} />)}

                {(loading === false && usr.id) && (
                    <div>
                        <Advert position="top" />

                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-style2 bg-gray-100 pd-12">
                                <li className="breadcrumb-item"><Link to="/face-of-campus">Face of campus</Link></li>
                                <li className="breadcrumb-item"><Link to={`/face-of-campus/dance/${foc.contest.slug}.${foc.contest.id}`}>{foc.contest.name}</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">{foc.dance.title}</li>
                            </ol>
                        </nav>

                        <div className="row mg-b-30">
                            <div className="col-12 col-lg-10">
                                <iframe src={`https://www.youtube-nocookie.com/embed/${foc.dance.video_code}`} title={foc.title}
                                    height={isMobile ? '240px' : '540px'} width="100%" frameBorder="0"
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style={{ background: '#000' }}
                                />
                                <h3 className="mg-t-20">{foc.dance.title}</h3>
                                <div className="mg-t-20">{foc.dance.description}</div>
                            </div>
                            <div className="col-12 col-lg-2">
                                <div className="badge badge-primary mg-b-10" children={`${foc.votes_nf} votes`} />
                                {foc.contest.canvote === true && (
                                    <Button type="primary" size="small" block disabled={foc.voted} loading={this.props._foc.voting} onClick={this.vote}>Vote</Button>
                                )}
                                {foc.video && (
                                    <Button type="primary" size="small" block className="mg-t-10" outline onClick={() => this.setState({ playVideo: foc.dance.video_code })}><i className="fa fa-play mg-r-5"></i> Play video</Button>
                                )}
                                {/* {logg.id === foc.user.id && (
                                    <Button type="dark" size="small" className="mg-t-10" block outline onClick={() => this.setState({ musicModal: true })}>Edit profile</Button>
                                )} */}
                            </div>
                        </div>
                        <hr />
                        <Comments item={`${contest}-${user}`} type="foc.dance" {...this.props} />

                        <Modal visible={playVideo} destroyOnClose={true} onCancel={() => this.setState({ playVideo: '' })} footer={null} title="Play video" width={900}>
                            <iframe src={`https://www.youtube-nocookie.com/embed/${playVideo}`} title={foc.title}
                                height={isMobile ? '250px' : '450px'} width="100%" frameBorder="0"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style={{ background: '#000' }}
                            />
                        </Modal>
                    </div>
                )}
            </React.Fragment>
        )
    }

}

export default FocDanceProfile;