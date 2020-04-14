import React from 'react';
// import { Link } from 'react-router-dom';
import * as func from '../utils/functions';

const Footer = props => {

    return (
        <footer className="footer">
            <div>
                <span>© 2016-{func.dates.yr} CampusPunch {func.app.version}</span>
                {/* <span>Hand-crafted by <a href="https://thewalkingkode.com" target="_blank" rel="noopener noreferrer">TheWalkingKode</a></span> */}
            </div>
            <div>
                <nav className="nav">
                    {/* <Link to="/apply-as-tutor" className="nav-link">Apply as tutor</Link> */}
                </nav>
            </div>
        </footer>
    );

};

export default Footer;