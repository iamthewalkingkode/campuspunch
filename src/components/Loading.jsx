import React from 'react';

const Loading = props => {
    const { text } = props;

    return (
        <React.Fragment>
            <div className="content content-fixed content-auth-alt">
                <div className="container ht-100p tx-center text-primary">
                    <div className="spinner-grow" role="status" /> <br /> {text || 'Loading...'}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Loading;