import React, { useEffect } from 'react';

const NotFound = props => {

    useEffect(() => {
        if (props.setMetaTags) {
            props.setMetaTags({ title: 'Page not found', description: '', keywords: '' });
            props.setHeaderTitle({ h1: '', h3: '', p: '', image: '' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="ht-100p d-flex flex-column align-items-center justify-content-center">
            <div className="wd-70p wd-sm-250 wd-lg-300 mg-b-15"><img src="/assets/img/404.png" className="img-fluid" alt="404" /></div>
            <h1 className="tx-color-01 tx-24 tx-sm-32 tx-lg-36 mg-xl-b-5">404 Page Not Found</h1>
            <h5 className="tx-16 tx-sm-18 tx-lg-20 tx-normal mg-b-20">Oopps. The page you were looking for doesn't exist.</h5>
            <p className="tx-color-03 mg-b-30">You may have mistyped the address or the page may have moved.</p>
        </div>
    );

};

export default NotFound;