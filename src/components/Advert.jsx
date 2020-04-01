import React, { useState, useEffect } from 'react';
import * as func from '../utils/functions';

const Advert = props => {
    const { position } = props;
    const [ad, setAd] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        func.post('ads', { position, status: 1, limit: 1, orderby: 'rand' }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setAd(res.result[0]);
            }
        });
    }, [position]);

    return (
        <div>
            {/* {loading === true && (
                <div>loading advert....</div>
            )} */}

            {loading === false && ad.id && (
                <div className="text-center mg-b-20 df-example" data-label="Advert" style={{ padding: 0 }}>
                    <a target={ad.target} rel="noopener noreferrer" href={ad.link}>
                        <img className="img-fluid" src={ad.image_link} alt={`${ad.title} - CampusPunch`} />
                    </a>
                </div>
            )}
        </div>
    );
};

export default Advert;