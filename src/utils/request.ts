import axios, { type AxiosResponse } from 'axios'
import { getDefaultStore } from 'jotai'
import { toast } from 'sonner'
import { isLoginAtom, userAtom } from '../stores/user';
import type { BaseResponse } from '../types/BaseResponse';
import { logout } from './userLoginHelper';

const jotaiStore = getDefaultStore()

const request = axios.create({
    baseURL: 'http://localhost:8070',
    withCredentials: true
})

request.interceptors.request.use((config) => {
    return config;
})

request.interceptors.response.use(
    (res: AxiosResponse<BaseResponse>) => {
        const { code, data, message, description } = res.data;
        if (code === 0) {
            return data;
        }
        // bussiness error
        console.log('error : ', message);
        return Promise.reject(new Error(description || 'Error'));
    },
    async (err) => {
        let msg = '';
        const { response } = err;
        if (response) {
            // 针对不同的 HTTP 状态码进行统一拦截
            switch (response.status) {
                case 401:
                    msg = "登录已过期，请重新登录";
                    jotaiStore.set(isLoginAtom, false);
                    jotaiStore.set(userAtom, null);
                    try {
                        await logout();
                    } catch (error) {
                        if (error instanceof Error) {
                            toast.error(error.message);
                        }
                    }
                    return Promise.reject();
                case 403:
                    msg = "当前操作无权限";
                    break;
                case 500:
                    msg = "服务器内部错误，请稍后重试";
                    break;
                default:
                    msg = `网络错误: ${response.status}`;
            }
        } else {
            // 处理断网或请求超时
            if (err.message.includes('timeout')) {
                msg = '请求超时，请检查网络';
            } else {
                msg = '网络连接异常';
            }
        }
        return Promise.reject(new Error(msg));
    }
)

export default request