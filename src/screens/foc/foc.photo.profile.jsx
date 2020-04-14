import React, { Component } from 'react';
import { Button, message } from 'antd';
import { Link } from 'react-router-dom';
import Lightbox from 'react-image-lightbox';
import * as func from '../../utils/functions';

import { Loading, Advert, Comments } from '../../components';
import NotFound from '../../partials/404';
// import moment from 'moment';

class FocPhotoProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usr: {}, foc: {},
            loading: true, submitting: false,
            lightImages: [], lightIndex: 0, lightOpen: false,
            username: parseInt(this.props.match.params.contest.split('.')[0]),
            contest: parseInt(this.props.match.params.contest.split('.')[1]),
            user: parseInt(this.props.match.params.user.split('.')[1])
        };
    }

    componentDidMount() {
        this.props.setHeaderBottom({ h1: '', h3: '', p: '', image: '' });
        this.props.setFooterTop({ h1: '', p: '', btnText: '', btnLink: '', image: '' });

        const { user, username, contest } = this.state;
        this.props.setMetaTags({ title: username, description: '', keywords: '' });
        this.setState({ loading: true });
        func.post('foc/users', { user, contest, voter: this.props.auth.logg.id, limit: 1 }).then(res => {
            if (res.status === 200) {
                var usr = res.result[0].user;
                setTimeout(() => {
                    window.init();
                }, 200);
                this.props.setMetaTags({ title: usr.username, description: usr.about, keywords: '' });
                this.setState({ usr, foc: res.result[0], lightImages: [usr.avatar_link] }, () => {
                    this.setState({ loading: false });
                });
            } else {
                this.setState({ loading: false });
            }
        });
    }

    vote = () => {
        const { user, contest, foc } = this.state;
        const { auth: { logg, authenticated } } = this.props;
        if (authenticated === true) {
            this.setState({ submitting: true });
            func.post('foc/vote', { contest, user, school: parseInt(foc.school.id), voter: logg.id, type: 'photo' }).then(res => {
                this.setState({ submitting: false });
                if (res.status === 200) {
                    this.setState({ foc: { ...foc, voted: true } });
                    message.success(res.result);
                } else {
                    message.error(res.result);
                }
            });
        } else {
            message.warning('You must sign in to place a vote');
        }
    }

    render() {
        // const { auth: { logg } } = this.props;
        const { loading, usr, foc, username, lightImages, lightIndex, lightOpen, user, contest, submitting } = this.state;

        return (
            <React.Fragment>
                {loading === true && (<Loading text={`loading ${username}'s profile...`} />)}
                {(loading === false && usr.id === undefined) && (<NotFound {...this.props} />)}

                {(loading === false && usr.id) && (
                    <div>
                        <Advert position="top" />
                        <div className="media d-block d-lg-flex">
                            <div className="profile-sidebar pd-lg-r-25">
                                <div className="row">
                                    <div className="col-sm-3 col-md-2 col-lg-12">
                                        <div className="avatar avatar-xxl avatar-onlines"><img src={usr.avatar_link} className="rounded-circle" alt={usr.username} /></div>
                                    </div>
                                    <div className="col-sm-8 col-md-7 col-lg-12 mg-t-20 mg-sm-t-0 mg-lg-t-25">
                                        <h5 className="mg-b-2 tx-spacing--1">{usr.fullname}</h5>
                                        <p className="tx-color-03 mg-b-25">@{usr.username}</p>
                                        {usr.about && (
                                            <div>
                                                <label className="tx-sans tx-10 tx-semibold tx-uppercase tx-color-01 tx-spacing-1 mg-b-5">About {usr.username}</label>
                                                <p className="tx-13 tx-color-02 mg-b-25">{usr.about}</p>
                                            </div>
                                        )}

                                        {usr.quote && (
                                            <div>
                                                <label className="tx-sans tx-10 tx-semibold tx-uppercase tx-color-01 tx-spacing-1 mg-b-5">{usr.username}'s personal quote</label>
                                                <p className="tx-13 tx-color-02 mg-b-25">{usr.quote}</p>
                                            </div>
                                        )}

                                        <div className="d-flex">
                                            <div className="profile-skillset flex-fill">
                                                <h4>{foc.votes_sf}</h4>
                                                <label>Votes</label>
                                            </div>
                                        </div>

                                        {foc.contest.canvote === true && (
                                            <div className="d-flex mg-b-25 mg-t-15">
                                                <Button type="primary" className="flex-fill" loading={submitting} disabled={foc.voted} onClick={() => this.vote()}>Vote</Button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-sm-6 col-md-5 col-lg mg-t-40">
                                        {(usr.twitter || usr.instagram || usr.facebook || usr.whatsapp) && (
                                            <label className="tx-sans tx-10 tx-semibold tx-uppercase tx-color-01 tx-spacing-1 mg-b-15">Websites &amp; Social Channel</label>
                                        )}
                                        <ul className="list-unstyled profile-info-list">
                                            <li><i data-feather="star"></i> <Link to={`/face-of-campus/photo/${foc.contest.slug}.${foc.contest.id}`}>{foc.contest.name}</Link></li>
                                            <li><i data-feather="home"></i> <Link to={`/face-of-campus/photo/school/${foc.school.slug}.${foc.school.id}/${foc.contest.slug}.${foc.contest.id}`}>{foc.school.name}</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="media-body mg-t-40 mg-lg-t-0">
                                <div className="card mg-b-20">
                                    <div className="card-body d-flex flex-row justify-content-around">
                                        <div className="profile-skillset flex-fills">
                                            <b>Height</b>
                                            <label>{usr.height || '00'}</label>
                                        </div>
                                        <div className="profile-skillset flex-fills">
                                            <b>Bust</b>
                                            <label>{usr.bust || '00'}</label>
                                        </div>
                                        <div className="profile-skillset flex-fills">
                                            <b>Waist</b>
                                            <label>{usr.waist || '00'}</label>
                                        </div>
                                        <div className="profile-skillset flex-fills">
                                            <b>Hips</b>
                                            <label>{usr.hips || '00'}</label>
                                        </div>
                                        <div className="profile-skillset flex-fills">
                                            <b>Shoe size</b>
                                            <label>{usr.shoe_size || '00'}</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="card mg-b-20 mg-lg-b-25">
                                    <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                                        <h6 className="tx-uppercase tx-semibold mg-b-0">{usr.username}'s Posts</h6>
                                    </div>
                                    <div className="card-body pd-20 pd-lg-25">
                                        <div className="row row-xxs">
                                            {lightImages.map(image => (
                                                <div className="col-4">
                                                    <span className="d-block ht-60s pointer" onClick={() => this.setState({ lightOpen: true })}>
                                                        <img src={image} className="img-fit-cover" alt={usr.username} />
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <Comments item={`${user}-${contest}`} type="foc" {...this.props} />
                    </div>
                )}

                {lightOpen === true && (
                    <Lightbox
                        mainSrc={lightImages[lightIndex]}
                        nextSrc={lightImages[(lightIndex + 1) % lightImages.length]}
                        prevSrc={lightImages[(lightIndex + lightImages.length - 1) % lightImages.length]}
                        onCloseRequest={() => this.setState({ lightOpen: false })}
                        onMovePrevRequest={() =>
                            this.setState({
                                lightIndex: (lightIndex + lightImages.length - 1) % lightImages.length
                            })
                        }
                        onMoveNextRequest={() =>
                            this.setState({
                                lightIndex: (lightIndex + 1) % lightImages.length
                            })
                        }
                    />
                )}
            </React.Fragment>
        )
    }

}

export default FocPhotoProfile;