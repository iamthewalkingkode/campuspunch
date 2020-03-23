import React, { Component } from 'react';

import AcademySelector from './components/Selector';

class AcademyHome extends Component {

    componentDidMount() {
        this.props.setMetaTags({ title: 'Academy', description: '', keywords: '' });
        this.props.setHeaderTitle({ h1: 'Academy', h3: '', p: '', image: '' });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    introAcademy = (e) => {
        const { history } = this.props;
        history.push(`/academy/intro/${e.school.slug}.${e.school.id}/${e.department.slug}.${e.department.id}/${e.level.slug}.${e.level.id}`);
    }

    render() {
        const { data: { schools } } = this.props;

        return (
            <React.Fragment>
                <div className="panel-group academy___selector" id="accordion" role="tablist" aria-multiselectable="true">
                    <Accordion id="students" title={'<b>STUDENTS</b> - What courses are you taking this semester ?'}>
                        <AcademySelector
                            schools={schools}
                            faculty={undefined}
                            category="student"
                            onOK={e => this.introAcademy(e)}
                        />
                    </Accordion>
                    <Accordion id="graduates" title={'<b>GRADUATES</b> - What courses are you taking this semester ?'}>
                        <AcademySelector
                            schools={schools.filter(school => school.id === 499)}
                            faculty={29}
                            category="graduate"
                            onOK={e => this.introAcademy(e)}
                        />
                    </Accordion>
                    <Accordion id="jambites" title={'<b>JAMBITES</b> - What courses are you taking this semester ?'} active={true}>
                        <AcademySelector
                            schools={schools.filter(school => school.id === 499)}
                            faculty={27}
                            category="jambite"
                            onOK={e => this.introAcademy(e)}
                        />
                    </Accordion>
                </div>
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