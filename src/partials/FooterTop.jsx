import React from 'react';
import { Link } from 'react-router-dom';

const FooterTop = props => {
    const { utils: { footerTop: { h1, p, btnText, btnLink, image } } } = props;

    return (
        (h1 || p || btnText) && (
            <div
                className="footer__bottom d-flex justify-content-center align-items-center"
                style={{ background: `linear-gradient(0deg, rgba(0,0,0, 0.6), rgba(0,0,0, 0.6)), url(/assets/img/${image || 'banner/footer.jpg'})` }}
            >
                <div className="text-center">
                    {h1 && (<h3 className="mg-b-10">{h1}</h3>)}
                    {p && (<p>{p}</p>)}
                    {btnText && !btnLink && (<span className="btn btn-warning pointer">{btnText}</span>)}
                    {btnText && btnLink && (<Link to={btnLink} className="btn btn-warning">{btnText}</Link>)}
                </div>
            </div>
        )
    );

};

export default FooterTop;