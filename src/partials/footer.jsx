import React from 'react';
import * as func from '../utils/functions';

const Footer = props => {

    return (
        <footer className="footer">
            <div>
                <span>© 2026-{func.dates.yr} CampusPunch {func.app.version}. </span>
                {/* <span>Hand-crafted by <a href="https://thewalkingkode.com" target="_blank" rel="noopener noreferrer">TheWalkingKode</a></span> */}
            </div>
        </footer>
    );

};

export default Footer;