import type { UserVO } from "../types/UserVO";
import request from "../utils/request";

export type UserUpdateRequest = {
    username?: string;
    image?: string;
    email?: string;
}

export type ChangePasswordRequest = {
    currentPassword: string;
    newPassword: string;
}

export async function getCurrentUser() {
    return request.get<any, UserVO>('/user/current');
}

export async function updateUserProfile(updateRequest: UserUpdateRequest) {
    return request.post<UserUpdateRequest, void>('/user/update', updateRequest);
}

export async function changePassword(changePasswordRequest: ChangePasswordRequest) {
    return request.post<ChangePasswordRequest, void>('/user/changePassword', changePasswordRequest);
}
