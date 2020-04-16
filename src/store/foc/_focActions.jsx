import { FOC_VOTE } from '../_types';
import publicIp from 'public-ip';
import * as func from '../../utils/functions';

export function focVote(key, data, onOK) {
    return dispatch => {
        (async () => {
            dispatch({ type: FOC_VOTE, value: key });
            const ip = await publicIp.v4({ fallbackUrls: ['https://ifconfig.co/ip'] }) || '::1';
            data['ip'] = ip;
            func.post('foc/vote', data).then(res => {
                dispatch({ type: FOC_VOTE, value: false });
                onOK(res.status, res.result);
            });
        })();
    }
};

export function focVoteSchool(key, data, onOK) {
    return dispatch => {
        (async () => {
            dispatch({ type: FOC_VOTE, value: key });
            const ip = await publicIp.v4({ fallbackUrls: ['https://ifconfig.co/ip'] });
            data['ip'] = ip;
            func.post('foc/voteschool', data).then(res => {
                dispatch({ type: FOC_VOTE, value: false });
                onOK(res.status, res.result);
            });
        })();
    }
};