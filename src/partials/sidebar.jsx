import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Select } from 'antd';
import * as qs from 'query-string';
import * as func from '../utils/functions';

import { Advert } from '../components';

const SideBar = props => {
    const { _data: { schools } } = props;
    const parsed = qs.parse(window.location.search);
    const [posts, setPosts] = useState([]);

    const searchQuery = (q) => {
        window.location.replace(`${window.location.pathname}?query=${q}`);
    }

    const searchSchool = (sch) => {
        sch = sch.split('@');
        window.location.replace(`/school/${sch[0]}.${sch[1]}`);
    }

    useEffect(() => {
        func.post('posts', { limit: 4, status: 1, orderby: 'clicks_desc' }).then(res => {
            if (res.status === 200) {
                setPosts(res.result);
            }
        });
    }, []);

    return (
        <div>
            {/* <Advert position="sidebar" /> */}
            <div>
                <Input.Search size="large" placeholder="Search an article" autoComplete="off" defaultValue={parsed.query} onSearch={q => searchQuery(q)} />
                <hr />
            </div>

            {/* <div className="mg-b-20">
                <h6 className="tx-uppercase tx-semibold mg-b-5">Pic of the Day</h6>
                <img className="img-thumbnail" src="http://sample.campuspunch.com/assets/img/campuspic.jpg" alt="pic of the day - CampusPunch" />
                <hr />
            </div> */}

            <div className="mg-b-20">
                <h6 className="tx-uppercase tx-semibold mg-b-5">Select a school</h6>
                <Select showSearch={true} autoComplete="off" size="large" optionFilterProp="children" onChange={sch => searchSchool(sch)}>
                    {schools.map(sch => (
                        <Select.Option key={sch.id} value={`${sch.slug}@${sch.id}`}>{sch.name}</Select.Option>
                    ))}
                </Select>
            </div>

            <Advert position="sidebar" />

            {posts.length > 0 && (
                <div className="mg-b-20">
                    <h6 className="tx-uppercase tx-semibold mg-b-5">Popular posts</h6>
                    <div className="list-group">
                        {posts.map(row => (
                            <div key={row.id} className="list-group-item d-flex align-items-centers">
                                <img src={row.image_link} className="ht-30 mg-r-15 rounded-circles" alt={row.title} />
                                <div className="">
                                    <Link to={`/article/${row.slug}.${row.id}`}>
                                        <h6 className="tx-inverse tx-semibold mg-b-0">{row.title}</h6>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Advert position="sidebar" />
        </div>
    );

};

export default SideBar;