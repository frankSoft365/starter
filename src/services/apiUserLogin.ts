import request from "../utils/request";
import type { UserLoginRequest, UserVO } from "../types/user";

export async function login(params: UserLoginRequest) {
    return request.post<UserLoginRequest, UserVO>('/user/login', params);
}

export async function logout() {
    return request.post<any, void>('/user/logout');
}