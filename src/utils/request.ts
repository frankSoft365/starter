import axios from 'axios'
import { getDefaultStore } from 'jotai'
import { doLogoutAtom } from '../stores/user'
import { toast } from 'sonner'

const jotaiStore = getDefaultStore()

const request = axios.create({ baseURL: 'http://127.0.0.1:8070' })

// 请求拦截：携带token
request.interceptors.request.use((config) => {
    const token = JSON.parse(localStorage.getItem('token') || 'null');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
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
    (err) => {
        if (err.response?.status === 401) {
            jotaiStore.set(doLogoutAtom)
        }
        return Promise.reject(err)
    }
)

export default request