import moment from 'moment';

export const api = {
    space: 'qa',
    apiKey: 'cnVgTUU8JEsvFJUGq7LGxBuxzW2ncmRdYZHPPBj7PWBR1177a5KINwgJMHgGTxN5',
    server_of: 'http://localhost/campuspunch.api/v1/',
    server_on: 'https://restapi.campuspunch.com/v1/',
    server_qa: 'http://api.redesign.campuspunch.com/v1/'
}

export const initialize = () => {
    api.apiURL = api[`server_${api.space}`];
    api.apiToken = getStorage('token');
}

export const app = {
    version: '2.0.0',
    dbpref: 'cp_'
}

export const dates = {
    yr: moment().format('YYYY')
}


// Storage
export const setStorage = (key, value) => {
    if (key) {
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


export const hasAccess = (find, access) => {
    if (access) {
        return access.includes('*') || access.includes(find);
    }
    return false;
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
    // data['mobile'] = 1;
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': api.apiKey + '.' + api.apiToken
            },
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
            headers: {
                'Accept': 'application/json',
                'Authorization': api.apiKey + '.' + api.apiToken
            },
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
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    }
    catch (error) {
        console.error(error);
    }
}

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

export const getTimeRemaining = (startDate, endDate) => {
    var t = Date.parse(endDate) - Date.parse(startDate);
    var s = Math.floor((t / 1000) % 60);
    var m = Math.floor((t / 1000 / 60) % 60);
    var h = Math.floor((t / (1000 * 60 * 60)) % 24);
    var d = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
        't': t,
        'd': d,
        'h': h,
        'm': m,
        's': s
    };
}