import React from 'react';
import * as func from '../../../utils/functions';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const NotificationsCard = props => {
    const { row, _auth: { logg } } = props;
    const [status, setStatus] = useState(row.status);

    const markRead = (row) => {
        setStatus(1);
        func.post('notifications/read', { user: logg.id, id: row.id }).then(res => {
            if (res.status === 100) {
                setStatus(0);
            }
        });
    }

    return (
        <React.Fragment>
            <div className="dropdown-item" style={{ borderBottom: '1px solid #eee' }}>
                <div className="media">
                    <div class={`avatar avatar-sm ${status === 0 && 'avatar-online'}`}>
                        <Link to={`/u/${row.initiator.username}`}><img src={row.initiator.avatar_link} className="rounded-circle" alt={row.username} /></Link>
                    </div>
                    <div className="media-body mg-l-15">
                        <p children={row.content} />
                        <span>{moment(row.crdate).format('LLL')}</span> &nbsp;
                        {status === 0 && (
                            <span className="pointer tx-semibold" onClick={() => markRead(row)}>Mark as read</span>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );

};

export default NotificationsCard;