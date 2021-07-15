import axios from "axios";
const instance = axios.create({
    baseURL:'http://localhost:8081',
    timeout:5000
});

instance.interceptors.request.use(
    config=>{
        return config;
    },
    err =>{
        return Promise.reject(err);
    }
);

instance.interceptors.response.use(
    response =>{
        return response;
    },
    err =>{
        return Promise.reject(err);
    }
);
export function get(url, params){
    return instance.get(url, {
        params
    })
}

export function post(url, data) {
    return instance.post(url, data);
}
