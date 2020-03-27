import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const NewsCard = props => {
    const { row } = props;
    const sch = row.schools[0];

    return (
        <React.Fragment>
            <div id="newsCard" className="card mg-b-20">
                <div className="card-body list-group">
                    <span className="list-group-item d-flex align-items-center bd-0 pd-0">
                        {row.image && (<div className="mg-r-20 news-image" style={{ backgroundImage: `url(${row.image_link})`}}></div>)}
                        <div>
                            <Link to={`/article/${row.slug}/${row.id}`} className="tx-20 tx-inverse tx-semibold mg-b-0">{row.title}</Link>
                            <div className="bd-t bd-b mg-t-4 mg-b-4 text-muted">
                                <small>
                                    <span>{moment(row.crdate, 'YYYY-MM-DD').format('LL')} </span>
                                    {sch.name ? <span>| <Link to={`/school/${sch.slug}/${sch.id}`}>{sch.name}</Link> </span> : ''}
                                    <span>| by <Link to={`/u/${row.user.username}`}>{row.user.username}</Link></span>
                                </small>
                            </div>
                            <p className="d-block tx-13 text-muteds">{row.content_small} ...</p>
                        </div>
                    </span>
                </div>
            </div>
        </React.Fragment>
    );
};

export default NewsCard;