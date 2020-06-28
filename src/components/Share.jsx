import React from 'react';

const Share = props => {

    return (
        <React.Fragment>
            SHARE:
            <div className="mg-t-10">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer">
                    <img src="assets/img/social/fb.png" alt="Facebook Share - CampusPunch" width="40px" />
                </a>
                &nbsp;
                <a href={`http://twitter.com/share?url=${window.location.href}`} target="_blank" rel="noopener noreferrer">
                    <img src="assets/img/social/tw.png" alt="Twitter Share - CampusPunch" width="35px" />
                </a>
            </div>
        </React.Fragment>
    );
};

export default Share;