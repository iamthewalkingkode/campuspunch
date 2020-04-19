import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as func from '../utils/functions';
import NotificationsCard from '../screens/user/components/notifications.card';

const Notifications = props => {
    const { _auth: { logg } } = props;
    const [unread, setUnread] = useState(0);
    const [data, setData] = useState([]);

    useEffect(() => {
        getNotifications();
        setInterval(() => {
            getNotifications();
        }, 300000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getNotifications = () => {
        func.post('notifications', { user: logg.id, limit: 8 }).then(res => {
            if (res.status === 200) {
                setUnread(res.unread);
                setData(res.result);
            }
        });
    }

    return (
        <React.Fragment>
            {logg.id && (
                <div class="dropdown dropdown-notification">
                    <span class="dropdown-link new-indicator pointer" data-toggle="dropdown">
                        <i data-feather="bell"></i>
                        {unread > 0 && (<span>{unread}</span>)}
                    </span>
                    <div class="dropdown-menu dropdown-menu-right">
                        <div class="dropdown-header">Notifications</div>
                        {data.map(row => (
                            <NotificationsCard {...props} key={row.key} row={row} />
                        ))}
                        <div class="dropdown-footer"><Link to="/user/notifications">View all Notifications</Link></div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );

};

export default Notifications;