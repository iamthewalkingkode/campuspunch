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
        this.props.setHeaderTitle({ h1: 'Academy', h3: '', p: '', image: 'banner/academy.png' });

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
                <div className="panel-group academy___selector" id="accordion" role="tablist" aria-multiselectable="true">
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

                {skills.length > 0 && (
                    <section className="mg-t-50">
                        <div className="text-center">
                            <h3 className="mg-b-0">Learn a new skill today</h3>
                            <p className="text-muted">Awesome skills to learn to make money</p>
                        </div>
                        <div className="row mg-t-30">
                            {skills.map(dep => (
                                <div className="col-6 col-lg-3">
                                    <div class="card mg-b-25 pointer" onClick={() => this.setState({ dep, visible: true })}>
                                        <img src="/assets/img/noimage.jpg" class="card-img-top" alt={dep.name} />
                                        <div class="card-bodys pd-15 text-center">
                                            <h6 class="card-title mg-b-0">{dep.name}</h6>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <Modal title="Choose a level to continue" visible={visible} closable={true} footer={null} maskClosable={false} width={300}
                    onCancel={() => this.setState({ visible: false, dep: {} })} style={{ top: 20 }}
                >
                    {levels.map(lvl => (
                        <button class="btn btn-xs btn-light btn-block text-left" onClick={() => this.openSkill(lvl)}>{lvl.name}</button>
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