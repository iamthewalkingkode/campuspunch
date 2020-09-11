import React from 'react';

const Loading = props => {
    const { text, size } = props;

    return (
        <React.Fragment>
            <div className={size !== 'small' ? 'content content-fixed content-auth-alt' : ''}>
                <div className={`tx-center text-primary ${size !== 'small' ? 'container ht-100p' : ''}`}>
                    <div className="spinner-grow" role="status" /> <br /> {text || 'loading...'}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Loading;