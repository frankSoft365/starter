import axios from 'axios'
import { getDefaultStore } from 'jotai'
import { toast } from 'sonner'
import { isLoginAtom, userAtom } from '../stores/user';
import { userLogout } from './userLoginHelper';

const jotaiStore = getDefaultStore()

const request = axios.create({
    baseURL: 'http://localhost:8070',
    withCredentials: true
})

// 请求拦截
request.interceptors.request.use((config) => {
    return config;
})

// 响应拦截：401 未登录，清空状态跳登录
request.interceptors.response.use(
    (res) => {
        if (res.data.code !== 0) {
            toast.error(res.data.description);
        }
        return res;
    },
    async (err) => {
        if (err.response?.status === 401) {
            jotaiStore.set(isLoginAtom, false);
            jotaiStore.set(userAtom, null);
            await userLogout();
            return Promise.resolve();
        }
        return Promise.reject(err)
    }
)

export default request