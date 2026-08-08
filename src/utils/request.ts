import axios, { type AxiosResponse } from 'axios'
import { getDefaultStore } from 'jotai'
import { toast } from 'sonner'
import { isLoginAtom, userAtom } from '../atoms/user';
import type { BaseResponse } from '../types/BaseResponse';
import { logout } from '../services/apiUserLogin';
import i18n from '@/i18n';

const jotaiStore = getDefaultStore()

const request = axios.create({
    // prod: https://aedium.franksoft.top
    // dev: http://localhost:8070
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8070',
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
        return Promise.reject(new Error(description || i18n.t('common.error')));
    },
    async (err) => {
        let msg = '';
        const { response } = err;
        if (response) {
            switch (response.status) {
                case 401:
                    msg = i18n.t('auth.error.loginExpired');
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
                    msg = i18n.t('common.noPermission');
                    break;
                case 500:
                    msg = i18n.t('common.serverError');
                    break;
                default:
                    msg = i18n.t('common.networkErrorWithCode', { code: response.status });
            }
        } else {
            if (err.message.includes('timeout')) {
                msg = i18n.t('common.timeout');
            } else {
                msg = i18n.t('common.networkConnection');
            }
        }
        return Promise.reject(new Error(msg));
    }
)

export default request;