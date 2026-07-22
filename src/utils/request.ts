import axios, { type AxiosResponse } from 'axios'
import { getDefaultStore } from 'jotai'
import { toast } from 'sonner'
import { isLoginAtom, userAtom } from '../atoms/user';
import type { BaseResponse } from '../types/BaseResponse';
import { logout } from '../services/apiUserLogin';

const jotaiStore = getDefaultStore()

const request = axios.create({
    // prod: https://aedium.franksoft.top
    // dev: http://localhost:8070
    baseURL: 'https://aedium.franksoft.top',
    withCredentials: true,
    timeout: 15000
})

request.interceptors.request.use((config) => {
    return config;
})

request.interceptors.response.use(
    (res: AxiosResponse<BaseResponse>) => {
        const { code, data, description } = res.data;
        if (code === 0) {
            return data;
        }
        // bussiness error
        return Promise.reject(new Error(description || 'Error'));
    },
    async (err) => {
        let msg = '';
        const { response } = err;
        if (response) {
            switch (response.status) {
                case 401:
                    msg = "Your login has expired. Please log in again.";
                    jotaiStore.set(isLoginAtom, false);
                    jotaiStore.set(userAtom, null);
                    try {
                        await logout();
                    } catch (error) {
                        if (error instanceof Error) {
                            toast.error(error.message);
                        }
                    }
                    return Promise.reject(new Error());
                case 403:
                    msg = "No permission is granted for the current operation.";
                    break;
                case 500:
                    msg = "A server error has occurred. Please try again later.";
                    break;
                default:
                    msg = `Network error, error code : ${response.status}`;
            }
        } else {
            if (err.message.includes('timeout')) {
                msg = 'Request timed out, please check your network.';
            } else {
                msg = 'Network connection error';
            }
        }
        return Promise.reject(new Error(msg));
    }
)

export default request;