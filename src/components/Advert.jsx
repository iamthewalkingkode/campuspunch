import React from 'react';

const Advert = props => {
    return (
        <div className="text-center mg-b-20 df-example" data-label="Advert" style={{ padding: 0 }}>
            <a target="_blank" rel="noopener noreferrer" href="http://api.whatsapp.com/send?phone=2347065191596">
                {props.type === 'side' &&(<img class="img-fluid" src="https://campuspunch.com/assets/img/ads/ad2.jpg" alt="advert - CampusPunch" />)}
                {props.type === 'top' && (<img class="img-fluid" src="https://campuspunch.com/assets/img/free_gift_ad.jpeg" alt="advert - CampusPunch" />)}
            </a>
        </div>
    );
};

export default Advert;