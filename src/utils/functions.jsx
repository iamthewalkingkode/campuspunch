import React from 'react';
import moment from 'moment';

export const api = {
    space: 'on',
    headers: {},
    headersFile: {},

    key_of: 'cnVgTUU8JEsvFJUGq7LGxBuxzW2ncmRdYZHPPBj7PWBR1177a5KINwgJMHgGTfgh',
    key_qa: 'ZLECSY8vfeSQRGY75dAry54jCgVNGHbpdtUy2Cb6bIXk9JhxjTmXFwb7NP3VG7g5',
    key_on: 'cnVgTUU8JEsvFJUGq7LGxBuxzW2ncmRdYZHPPBj7PWBR1177a5KINwgJMHgGTxN5',

    server_of: 'http://localhost/campuspunch/api/v1/',
    server_on: 'https://api.campuspunch.com/v1/',
    server_qa: 'https://qa-api.campuspunch.com/v1/',

    platform_of: 'localhost',
    platform_qa: 'qa.campuspunch.com',
    platform_on: 'campuspunch.com',
}

export const app = {
    version: '1.0.0',
    dbpref: 'cp_'
}

export const initialize = () => {
    if (window.location.host.match(/localhost/i)) {
        api.space = 'on';
    } else if (window.location.host === 'qa.campuspunch.com') {
        api.space = 'qa';
    } else {
        api.space = 'on';
    }
    api.apiURL = api[`server_${api.space}`];
    api.apiKey = api[`key_${api.space}`];
    api.apiPlatform = api[`platform_${api.space}`];
    api.apiToken = getStorage('token');

    api.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Platform': `${api.apiPlatform}/${app.version}`,
        'Authorization': `${api.apiKey}.${api.apiToken}`,
        'cp-access-token': `${api.apiKey}.${api.apiToken}`
    };
    api.headersFile = {
        'Accept': 'application/json',
        'Platform': `${api.apiPlatform}/${app.version}`,
        'Authorization': `${api.apiKey}.${api.apiToken}`,
        'cp-access-token': `${api.apiKey}.${api.apiToken}`
    };
}

export const dates = {
    yr: moment().format('YYYY')
}


// Storage
export const setStorage = (key, value) => {
    if (key && value) {
        localStorage.setItem(app.dbpref + key, value);
    }
}
export const getStorage = (key) => {
    const value = localStorage.getItem(app.dbpref + key);
    return value || '';
}
export const setStorageJson = (key, value) => {
    if (key && value) {
        localStorage.setItem(app.dbpref + key, JSON.stringify(value));
    }
}
export const getStorageJson = (key) => {
    if (key) {
        const value = localStorage.getItem(app.dbpref + key);
        return JSON.parse(value) || [];
    }
}
export const delStorage = (key) => {
    if (key) {
        localStorage.removeItem(app.dbpref + key);
    }
}


export const inArray = (needle, haystack) => {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] === needle) return true;
    }
    return false;
}
export const mergeObj = (obj, src) => {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}
export const getFileExtension = (filename) => {
    var ext = /^.+\.([^.]+)$/.exec(filename);
    return ext === null ? '' : ext[1];
}


// Data Request
initialize();
export const jsnData = (str) => {
    if (typeof str !== 'object') {
        var obj = {};
        var data = str.split('&');
        for (var key in data) {
            obj[data[key].split('=')[0]] = data[key].split('=')[1];
        }
        return obj;
    }
    return str;
}
export const serData = (obj) => {
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
    }
    return str.join('&');
}
export const apnData = (obj) => {
    const body = new FormData();
    for (var p in obj) {
        if (p === 'file') {
            body.append('file[0]', obj[p]);
        } else if (p === 'image') {
            body.append('image[0]', obj[p]);
        } else {
            body.append(p, obj[p]);
        }
    }
    return body;
}
export const post = async (action, data = {}, empty = false) => {
    let url = ((empty === false) ? api.apiURL + action : action);
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: api.headers,
            body: JSON.stringify(data)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return { status: 606, result: 'Network request failed', error: error };
    }
}
export const postFile = async (action, data = {}, empty = false) => {
    let url = ((empty === false) ? api.apiURL + action : action);
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: api.headersFile,
            body: apnData(data)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return { status: 606, result: 'Network request failed', error: error };
    }
}
export const getData = async (action, data = {}) => {
    try {
        const response = await fetch(api.apiURL + action, {
            method: 'POST',
            headers: api.headers
        });
        return response.json();
    }
    catch (error) {
        console.error(error);
    }
}

// Spinners
export const fspinner = <div style={{ textAlign: 'center', color: '#999', lineHeight: 320 + 'px', width: 100 + '%' }}><i className="fa fa-spin fa-circle-o-notch fa-5x"></i></div>;
export const fspinner_sm = <div style={{ textAlign: 'center', color: '#999', lineHeight: 120 + 'px', width: 100 + '%' }}><i className="fa fa-spin fa-circle-o-notch fa-3x"></i></div>;
export const fspinner_xs = <i className="fa fa-spin fa-circle-o-notch"></i>;

export const redirect = (to) => {
    window.location = to;
}

export const generateOptions = (length, step = 1) => {
    const arr = [];
    for (let value = 0; value < length; value += step) {
        arr.push(value);
    }
    return arr;
};

export const hasAccess = (find, access) => {
    if (access) {
        return access.includes('*') || access.includes(find);
    }
    return false;
}

export const shuffle = (array) => {
    array.sort(() => Math.random() - 0.5);
}