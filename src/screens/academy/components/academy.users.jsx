import React, { useEffect, useState } from 'react';
import { Modal, Pagination, Button, message } from 'antd'
import * as func from '../../../utils/functions';
import { Loading } from '../../../components';

const AcademyUsers = props => {
    const { level, department, visible, _data: { settings } } = props;

    const limit = 6;
    const [data, setData] = useState([]);
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentStep, setCurrentStep] = useState(1);
    const [errMessage, setErrMessage] = useState('');

    useEffect(() => {
        getUsers(step);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const nextPrev = (e) => {
        setCurrentStep(e);
        getUsers((e - 1) * limit);
    }

    const getUsers = (stap) => {
        setLoading(true);
        setStep(stap);
        func.post('academy/users', { level, department, status: 1, limit: `${stap},${limit}` }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setData(res.result);
                setTotal(res.count);
            }
        });
    }

    return (
        <React.Fragment>
            <Modal visible={visible} title="Find a buddy" width={600} footer={null} onCancel={props.onCancel} className={errMessage ? 'animated shake' : ''}>
                {loading === true && (<Loading text="loading buddies..." size="small" />)}
                {loading === false && (
                    <div>
                        {errMessage === '' && (
                            <div className="alert alert-info text-center">
                                <i className="fa fa-exclamation-circle"></i> &nbsp; You can only add {settings.academy_buddy_limit} people as buddies.
                            </div>
                        )}
                        {errMessage && (
                            <div className="alert alert-danger text-center">{errMessage}</div>
                        )}
                        <div class="list-group">
                            {data.map(row => (
                                <Buddycard {...props} row={row} setErrMessage={(e) => setErrMessage(e)} />
                            ))}
                        </div>
                    </div>
                )}

                {total > limit && !loading && (<Pagination total={total} pageSize={limit} current={currentStep} onChange={(e) => nextPrev(e)} />)}
            </Modal>
        </React.Fragment>
    );

};
export default AcademyUsers;

const Buddycard = props => {
    const { row, _auth: { logg }, level, department } = props;
    const [submitting, setSubmitting] = useState(false);

    const connect = (buddy) => {
        props.setErrMessage('');
        setSubmitting(true);
        func.post('academy/buddies_insert', { level, department, status: 1, buddy, user: logg.id }).then(res => {
            setSubmitting(false);
            if (res.status === 200) {
                message.success(res.result);
                props.onOk();
            } else {
                props.setErrMessage(res.result);
            }
        });
    }

    return (
        <React.Fragment>
            <div class="list-group-item d-flex align-items-center">
                <img src={row.user.avatar_link} class="wd-30 rounded-circle mg-r-15" alt={row.user.username} />
                <div className="wd-100p">
                    <div className="row">
                        <div className="col-8">
                            <h6 class="tx-13 tx-inverse tx-semibold mg-b-0">@{row.user.username}</h6>
                            <span class="d-block tx-11 text-muted">
                                {row.user.school.name} &sdot; {row.user.category}
                            </span>
                        </div>
                        <div className="col-4 text-right">
                            <Button type="primary" shape="circle-outline" size="small" loading={submitting} onClick={() => connect(row.user.id)}>Connect</Button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}