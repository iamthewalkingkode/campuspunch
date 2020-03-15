import React from 'react';

const Advert = props => {
    return (
        <div className="text-center mg-b-20 df-example" data-label="Advert" style={{ padding: 0 }}>
            <a target="_blank" rel="noopener noreferrer" href="http://api.whatsapp.com/send?phone=2347065191596">
                <img class="img-fluid" src={`/assets/img/ad/${props.type}.jpg`} alt="advert - CampusPunch" />
            </a>
        </div>
    );
};

export default Advert;