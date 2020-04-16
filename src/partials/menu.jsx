import React from 'react';
import { Link } from 'react-router-dom';

const Menu = props => {
  const root = props.router.location.pathname.split('/')[1];
  const { data: { menus }, _auth: { authenticated } } = props;

  return (
    <ul className="nav navbar-menu">
      {/* <li className="nav-label pd-l-15 pd-lg-l-25 d-lg-none">Main Navigation</li> */}
      {menus.map(menu => (
        (menu.auth === undefined || authenticated === menu.auth) && (
          (menu.subs || []).length > 0 ? (
            <li key={menu.link} className={`nav-item with-sub ${root === menu.link ? 'active' : ''}`}>
              <span className="nav-link pointer">{menu.name}</span>
              <ul className="navbar-menu-sub">
                {menu.subs.map(sub => (
                  <li key={sub.link} className="nav-sub-item"><Link to={`/${sub.link}`} className="nav-sub-link">{sub.name}</Link></li>
                ))}
              </ul>
            </li>
          ) : (
              <li key={menu.link} className={`nav-item ${root === menu.link ? 'active' : ''}`}><Link to={`/${menu.link}`} className="nav-link">{menu.name}</Link></li>
            )
        )
      ))}
    </ul>
  );

};

export default Menu;