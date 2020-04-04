import React, { Component } from 'react';
import * as func from '../../utils/functions';
import { Link } from 'react-router-dom';

import { Loading } from '../../components';

class UserAcademySubs extends Component {

    state = {
        data: [],
        loading: true
    }

    componentDidMount() {
        this.props.setHeaderTitle({ h1: '', h3: '', p: '', image: '' });

        func.post('academy/subscriptions', { user: this.props.auth.logg.id }).then(res => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.setState({ loading: false });
            if (res.status === 200) {
                this.setState({ data: res.result });
            }
        });
    }

    render() {
        const { loading, data } = this.state;

        return (
            <React.Fragment>
                {loading === true && (<Loading text={`loading subscriptions...`} />)}

                {loading === false && (
                    <div className="list-group mg-b-25">
                        {data.map(row => {
                            const dep = row.department;
                            const sch = dep.school;
                            const lvl = row.level;
                            return (
                                <Link class={`list-group-item d-flex align-items-center pointer mg-b-5`} to={`/academy/enter/${sch.slug}.${sch.id}/${dep.slug}.${dep.id}/${lvl.slug}.${lvl.id}`}>
                                    <img src={sch.image_link} class="wd-50 ht-50 rounded-circle mg-r-15" alt={sch.name} />
                                    <div>
                                        <h6 class="tx-inverse tx-semibold mg-b-0">{sch.name} - {dep.name} - {lvl.name}</h6>
                                        <span class="d-block text-muted">₦{row.amount_nf}</span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </React.Fragment>
        )
    }

}

export default UserAcademySubs;