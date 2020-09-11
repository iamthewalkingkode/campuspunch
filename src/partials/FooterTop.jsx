import React, { useState } from 'react';
import { PartnerForm } from '../components';

const FooterTop = props => {
    const { _utils: { footerTop: { h1, p, btnText, btnAction, image } } } = props;
    const bg = ['http', 'https'].includes(image.split('://')[0]) ? image : `/assets/img/${image || 'banner/footer.jpg'}`;

    const [action, setAction] = useState('');

    return (
        <React.Fragment>
            {(h1 || p || btnText) && (
                <div
                    className="footer__bottom d-flex justify-content-center align-items-center"
                    style={{ background: `linear-gradient(0deg, rgba(0,0,0, 0.6), rgba(0,0,0, 0.6)), url(${bg})` }}
                >
                    <div className="text-center">
                        {h1 && (<h1 dangerouslySetInnerHTML={{ __html: h1 }} className="mg-b-10" />)}
                        {p && (<h3 dangerouslySetInnerHTML={{ __html: p }} />)}
                        {h1 && p && btnText && (
                            <span onClick={() => btnAction && setAction(btnAction)} className="btn btn-warning pointer mg-t-25">{btnText}</span>
                        )}
                    </div>
                </div>
            )}

            <PartnerForm visible={action === 'partner-form' ? true : false} onCancel={() => setAction('')} />
        </React.Fragment>
    );

};

export default FooterTop;