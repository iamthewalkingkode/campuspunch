import React from 'react';
import { Input, Select } from 'antd';
import * as qs from 'query-string';

import { Advert } from '../components';

const SideBar = props => {
    const { utils: { schools } } = props;
    const parsed = qs.parse(window.location.search);

    const searchQuery = (q) => {
        window.location.replace(`/news?query=${q}`);
    }

    const searchSchool = (sch) => {
        sch = sch.split('@');
        window.location.replace(`/school/${sch[0]}/${sch[1]}`);
    }

    return (
        <div>
            {/* <Advert type="side" /> */}
            <div>
                <Input.Search size="large" placeholder="Search an article" autoComplete="off" defaultValue={parsed.query} onSearch={q => searchQuery(q)} />
                <hr />
            </div>

            <div className="mg-b-20">
                <h6 className="tx-uppercase tx-semibold mg-b-5">Pic of the Day</h6>
                <img className="img-thumbnail" src="http://sample.campuspunch.com/assets/img/campuspic.jpg" alt="pic of the day - CampusPunch" />
                <hr />
            </div>

            <div className="mg-b-20">
                <h6 className="tx-uppercase tx-semibold mg-b-5">Select a school</h6>
                <Select showSearch={true} autoComplete="off" size="large" onChange={sch => searchSchool(sch)}>
                    {schools.map(sch => (
                        <Select.Option key={sch.id} value={`${sch.slug}@${sch.id}`}>{sch.name}</Select.Option>
                    ))}
                </Select>
            </div>

            <Advert type="side" />

            <div className="mg-b-20">
                <h6 className="tx-uppercase tx-semibold mg-b-5">Popular posts</h6>
                <ul class="list-group">
                    <li class="list-group-item">Cras justo odio</li>
                    <li class="list-group-item">Dapibus ac facilisis in</li>
                    <li class="list-group-item">Morbi leo risus</li>
                    <li class="list-group-item">Porta ac consectetur ac</li>
                    <li class="list-group-item">Vestibulum at eros</li>
                </ul>
            </div>

            <Advert type="side" />
        </div>
    );

};

export default SideBar;