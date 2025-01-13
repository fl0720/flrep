//封装axios
import axios from "axios";
import store from "@/store";
import JSONbig from "json-bigint";
import { getToken } from '@/utils/auth'
//创建axios实例
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const request = axios.create({
    baseURL: "/api",
    // headers: {"Content-Type": "application/json;charset=UTF-8"},
    timeout: 10000, // 请求超时时间
    transformResponse: [
        function (data) {
            try {
                return JSONbig.parse(data);
            } catch (err) {
                // console.log("转换失败", err);
                return data;
            }
        }
    ]
});
//请求拦截器
request.interceptors.request.use(
    (config) => {
        //vuex有没有token
        // let token = store.state.token;
        // //vuex有没有登录token
        // let isLoginToken = store.state.token.user.token;
        // if (isLoginToken) {
        //     config.headers.Authorization = `Bearer ${isLoginToken}`;
        // }
        const isToken = (config.headers || {}).isToken === false
        // 是否需要防止数据重复提交
        // const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
        if (getToken() && !isToken) {
            config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
//响应拦截器
request.interceptors.response.use((response) => {

        let res_data = response.data
        if (res_data.code == '200') {
            return res_data
        } else {
            if(res_data.msg) {
                // this.$notify(res_data.msg);
            }
            return false
        }
        // return response.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default request;
