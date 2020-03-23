import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Comments } from '../../components';
import AcademySidebar from './components/Sidebar';

class AcademyChat extends Component {

    state = {
        loading: true,
        courses: [], ipaid: 0,
        path: this.props.location.pathname.split('/'),
        level: parseInt(this.props.match.params.level.split('.')[1]),
        school: parseInt(this.props.match.params.school.split('.')[1]),
        department: parseInt(this.props.match.params.department.split('.')[1])
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Academy', description: '', keywords: '' });
        this.props.setHeaderTitle({ h1: 'Academy', h3: '', p: 'Lecturer\'s chat', image: '' });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    render() {
        const { school, department, level, path } = this.state;

        return (
            <React.Fragment>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-style2 bg-gray-100 pd-12">
                        <li className="breadcrumb-item"><Link to="/academy">Academy</Link></li>
                        <li className="breadcrumb-item"><Link to={`/${path[1]}/intro/${path[3]}/${path[4]}/${path[5]}`}>Introduction</Link></li>
                        <li className="breadcrumb-item"><Link to={`/${path[1]}/enter/${path[3]}/${path[4]}/${path[5]}`}>Enter</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Lecturer's chat</li>
                    </ol>
                </nav>

                <div className="row">
                    <div className="col-lg-4 col-12">
                        <AcademySidebar display="menu" {...this.props} />
                    </div>
                    <div className="col-lg-8 col-12">
                        <div className="pd-15 bg-gray-200">
                            <Comments item={`${school}-${department}-${level}`} type="chat" {...this.props} />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}

export default AcademyChat;