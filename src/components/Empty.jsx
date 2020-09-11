import React from 'react';

const Loading = props => {
    const { h1, h5, image } = props;

    return (
        <React.Fragment>
            <div className="ht-100p d-flex flex-column align-items-center justify-content-center">
                <div className="wd-70p wd-sm-250 wd-lg-300 mg-b-15"><img src={image || '/assets/img/404.png'} className="img-fluid" alt="404" /></div>
                <h2 className="tx-color-01  mg-xl-b-5">{h1 || 'No records found'}</h2>
                <h5 className="mg-b-20 tx-color-03">{h5 || 'No records found'}</h5>
            </div>
        </React.Fragment>
    );
};

export default Loading;