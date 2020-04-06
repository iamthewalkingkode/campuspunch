import React from 'react';

const HeaderBottom = props => {
    const { utils: { headerBottom: { h1, h3, p, image } } } = props;

    return (
        (h1 || h3 || p) && (
            <div
                className="header___bottom d-flex justify-content-center align-items-center"
                style={{ background: `linear-gradient(0deg, rgba(4, 40, 147, 0.6), rgba(4, 40, 147, 0.6)), url(/assets/img/${image})` }}
            >
                <div className="text-center">
                    {h1 && (<h1 className="mg-b-10">{h1}</h1>)}
                    {h3 && (<h3>{h3}</h3>)}
                    {p && (<p>{p}</p>)}
                </div>
            </div>
        )
    );

};

export default HeaderBottom;