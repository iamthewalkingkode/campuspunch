import React from 'react';

export const Head = props => {
    const { id, title, active } = props;
    return (
        <li className="nav-item">
            <a className={`nav-link ${active ? 'active' : ''}`} id={`${id}-tab`} data-toggle="tab" href={`#${id}`} role="tab" aria-controls={id} aria-selected={active}>{title}</a>
        </li>
    )
}

export const Body = props => {
    const { id, children, active } = props;
    return (
        <div className={`tab-pane fade ${active ? 'show active' : ''}`} id={id} role="tabpanel" aria-labelledby={`${id}-tab`}>
            {children}
        </div>
    )
}