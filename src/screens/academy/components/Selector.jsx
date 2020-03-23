import React from 'react';
import { Form, Select, Button } from 'antd';
import { useState } from 'react';
import * as func from '../../../utils/functions';

const Screen = props => {
    const { schools, faculty, category, form: { getFieldDecorator, validateFields } } = props;
    const [final, setFinal] = useState({});
    const [loading, setLoading] = useState(false);
    const [levels, setLevels] = useState([]);
    const [departments, setDepartments] = useState([]);

    const getDepartmentsLevels = (school) => {
        setFinal({ ...final, school });
        setLoading(true);
        func.post('academy/departments', { school, faculty, status: 1 }).then(res => {
            if (res.status === 200) {
                setDepartments(res.result);
            }
        });
        func.post('academy/levels', { category, status: 1 }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setLevels(res.result);
            }
        });
    }

    const sendOK = (e) => {
        e.preventDefault();
        validateFields((err, v) => {
            if (!err) {
                const ok = {
                    school: schools.filter(sch => sch.id === final.school)[0],
                    department: departments.filter(dep => dep.id === final.department)[0],
                    level: levels.filter(lvl => lvl.id === final.level)[0]
                }
                props.onOK(ok);
            }
        });
    }

    return (
        <Form hideRequiredMark={false} onSubmit={sendOK}>
            <div className="row">
                <div className="col-lg-4 col-sm-4 col-xs-6 form-group">
                    <Form.Item colon={false} label={null}>
                        {getFieldDecorator('school', {
                            rules: [{ required: true, message: 'School is required' }]
                        })(
                            <Select showSearch={true} size="large" loading={loading} optionFilterProp="children" placeholder="Choose a school" onChange={e => getDepartmentsLevels(e)}>
                                {schools.map(sch => (
                                    <Select.Option value={sch.id}>{sch.name}</Select.Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                </div>
                <div className="col-lg-4 col-sm-4 col-xs-6 form-group">
                    <Form.Item colon={false} label={null}>
                        {getFieldDecorator('department', {
                            rules: [{ required: true, message: 'Department is required' }]
                        })(
                            <Select showSearch={true} size="large" loading={loading} optionFilterProp="children" placeholder="Choose a department" onChange={department => setFinal({ ...final, department })}>
                                {departments.map(dep => (
                                    <Select.Option value={dep.id}>{dep.name}</Select.Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                </div>
                <div className="col-lg-4 col-sm-4 col-xs-6 form-group">
                    <Form.Item colon={false} label={null}>
                        {getFieldDecorator('level', {
                            rules: [{ required: true, message: 'Level is required' }]
                        })(
                            <Select showSearch={true} size="large" loading={loading} optionFilterProp="children" placeholder="Choose a level" onChange={level => setFinal({ ...final, level })}>
                                {levels.map(lvl => (
                                    <Select.Option value={lvl.id}>{lvl.name}</Select.Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                </div>
                <div className="col-lg-5 col-sm-5 hidden-xs"></div>
                <div className="col-lg-2 col-sm-2 col-xs-6 form-group">
                    <Button type="primary" htmlType="submit" block loading={loading}> Enter</Button>
                </div>
                <div className="col-lg-5 col-sm-5 hidden-xs"></div>
            </div>
        </Form>
    );

};

const AcademySelector = Form.create()(Screen);
export default AcademySelector;