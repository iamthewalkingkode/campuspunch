import React from 'react';
import * as func from '../utils/functions';

const Footer = props => {

    return (
        <footer class="footer">
            <div>
                <span>© 2019-{func.dates.yr} JavaGroup {func.app.version}. </span>
                <span>Hand-crafted by <a href="https://thewalkingkode.com" target="_blank" rel="noopener noreferrer">TheWalkingKode</a></span>
            </div>
        </footer>
    );

};

export default Footer;