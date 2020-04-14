import React, { Component } from 'react';
import * as func from '../../utils/functions';

import AcademySelector from './components/Selector';
import { Modal } from 'antd';

class AcademyHome extends Component {

    state = {
        visible: false, skills: [], levels: [], dep: {}
    }

    componentDidMount() {
        this.props.setMetaTags({ title: 'Academy', description: '', keywords: '' });
        this.props.setHeaderBottom({ h1: 'Academy', h3: '', p: '', image: 'banner/academy.png' });
        this.props.setFooterTop({ h1: 'SPONSOR A GROUP', p: 'Transform someone\'s life, a group, or your employees career skills by sponsoring them to learn a course', btnText: 'Get Started Now', btnLink: '', image: '' });

        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.getSkills();
    }

    getSkills = () => {
        func.post('academy/departments', { school: 499, faculty: 28, status: 1, orderby: 'name_asc' }).then(res => {
            if (res.status === 200) {
                this.setState({ skills: res.result });
            }
        });
        func.post('academy/levels', { category: 'non-campus', status: 1, orderby: 'name_asc' }).then(res => {
            if (res.status === 200) {
                this.setState({ levels: res.result });
            }
        });
    }

    introAcademy = (e) => {
        const { history } = this.props;
        history.push(`/academy/intro/${e.school.slug}.${e.school.id}/${e.department.slug}.${e.department.id}/${e.level.slug}.${e.level.id}`);
    }

    openSkill = (lvl) => {
        const { dep } = this.state;
        const { history } = this.props;
        history.push(`/academy/intro/${dep.school.slug}.${dep.school.id}/${dep.slug}.${dep.id}/${lvl.slug}.${lvl.id}`);
    }

    render() {
        const { data: { schools } } = this.props;
        const { skills, levels, visible } = this.state;

        return (
            <React.Fragment>
                <div className="panel-group academy___selector mg-b-50" id="accordion" role="tablist" aria-multiselectable="true">
                    <Accordion id="students" title={'<b>STUDENTS</b> - What courses are you taking this semester?'}>
                        <AcademySelector
                            schools={schools}
                            faculty={undefined}
                            category="student"
                            onOK={e => this.introAcademy(e)}
                        />
                    </Accordion>
                    <Accordion id="graduates" title={'<b>GRADUATES</b> - What courses are you taking this year?'}>
                        <AcademySelector
                            schools={schools.filter(school => school.id === 499)}
                            faculty={29}
                            category="graduate"
                            onOK={e => this.introAcademy(e)}
                        />
                    </Accordion>
                    <Accordion id="jambites" title={'<b>JAMBITES</b> - What exams are you taking this year?'} active={true}>
                        <AcademySelector
                            schools={schools.filter(school => school.id === 499)}
                            faculty={27}
                            category="jambite"
                            onOK={e => this.introAcademy(e)}
                        />
                    </Accordion>
                </div>
                <hr />
                {skills.length > 0 && (
                    <section className="mg-t-50 mg-b-50">
                        <div className="text-center">
                            <h3 className="mg-b-0">Learn a new skill today</h3>
                            <p className="text-muted">Awesome skills to learn to make money</p>
                        </div>
                        <div className="row mg-t-30">
                            {skills.map(dep => (
                                <div className="col-12 col-lg-3">
                                    <div className="card mg-b-25 pointer" onClick={() => this.setState({ dep, visible: true })}>
                                        <div className="pos-relative">
                                            <div className="marker pos-absolute t-10 l-10 bg-primary tx-white">₦3,000</div>
                                            <img src={dep.image_link} className="card-img-top" alt={dep.name} />
                                        </div>
                                        <div className="card-bodys pd-15 text-center">
                                            <h6 className="card-title mg-b-0">{dep.name}</h6>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <hr />

                <section className="mg-t-50 mg-b-50">
                    <div className="text-center">
                        <h3 className="mg-b-0">Why students love us</h3>
                    </div>
                    <div className="row row-xl text-center mg-t-30">
                        <div className="col-12 col-lg-4">
                            <i className="fa fa-certificate fa-2x text-muted"></i>
                            <div className="tx-bold mg-t-10 mg-b-10">Certificate</div>
                            <p>Earn an internationally recognized certificate delivered to your doorstep</p>
                        </div>
                        <div className="col-12 col-lg-4">
                            <i className="fa fa-users fa-2x text-muted"></i>
                            <div className="tx-bold mg-t-10 mg-b-10">Study Partner</div>
                            <p>Studying alone can be boring. Get matched up with a perfect study buddy near you!</p>
                        </div>
                        <div className="col-12 col-lg-4">
                            <i className="fa fa-briefcase fa-2x text-muted"></i>
                            <div className="tx-bold mg-t-10 mg-b-10">Jobs</div>
                            <p>Get immediate job offers studying any course</p>
                        </div>
                    </div>
                </section>

                <Modal title="Choose a level to continue" visible={visible} closable={true} footer={null} maskClosable={false} width={300}
                    onCancel={() => this.setState({ visible: false, dep: {} })} style={{ top: 20 }}
                >
                    {levels.map(lvl => (
                        <button className="btn btn-xs btn-light btn-block text-left" onClick={() => this.openSkill(lvl)}>{lvl.name}</button>
                    ))}
                </Modal>
            </React.Fragment>
        )
    }

}

export default AcademyHome;

const Accordion = props => (
    <div className="panel panel-primary">
        <div className="panel-heading" role="tab" id={`headeing${props.id}`}>
            <h4 className="panel-title">
                <a role="button" data-toggle="collapse" data-parent="#accordion" href={`#${props.id}`} aria-controls={props.id}>
                    <span dangerouslySetInnerHTML={{ __html: props.title }}></span>
                </a>
            </h4>
        </div>
        <div id={props.id} className={`panel-collapse collapse ${props.active ? 'in show' : ''}`} role="tabpanel" aria-labelledby={`headeing${props.id}`}>
            <div className="panel-body">
                <p>&nbsp;</p>
                {props.children}
                <p>&nbsp;</p>
            </div>
        </div>
    </div>
)