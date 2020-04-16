import React from 'react';
import { Link } from 'react-router-dom';

const FooterTop = props => {
    const { _utils: { footerTop: { h1, p, btnText, btnLink, image } } } = props;
    const bg = ['http', 'https'].includes(image.split('://')[0]) ? image : `/assets/img/${image || 'banner/footer.jpg'}`;

    return (
        (h1 || p || btnText) && (
            <div
                className="footer__bottom d-flex justify-content-center align-items-center"
                style={{ background: `linear-gradient(0deg, rgba(0,0,0, 0.6), rgba(0,0,0, 0.6)), url(${bg})` }}
            >
                <div className="text-center">
                    {h1 && (<h1 className="mg-b-10">{h1}</h1>)}
                    {p && (<h3>{p}</h3>)}
                    {btnText && !btnLink && (<span className="btn btn-warning pointer mg-t-25">{btnText}</span>)}
                    {btnText && btnLink && (<Link to={btnLink} className="btn btn-warning mg-t-25">{btnText}</Link>)}
                </div>
            </div>
        )
    );

};

export default FooterTop;