import React from 'react';
import { FormattedMessage } from 'react-intl';

const Footer = props => {
  const { auth: { logg } } = props;

  return (
    <div className="aside-loggedin">
      <div className="d-flex align-items-center justify-content-start">
        <span className="avatar"><img src={logg.avatar_link} className="rounded-circle" alt={logg.name} /></span>
      </div>
      <div className="aside-loggedin-user">
        <span className="d-flex align-items-center justify-content-between mg-b-2">
          <h6 className="tx-semibold mg-b-0">{logg.name}</h6>
        </span>
        <p className="tx-color-03 tx-12 mg-b-0">{logg.coins_nf} <FormattedMessage id="Label.Coins" defaultMessage="Coins" /></p>
      </div>
    </div>
  );

};

export default Footer;