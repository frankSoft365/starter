import type { ChangePasswordRequest, UserUpdateRequest, UserVO } from "../types/user";
import request from "../utils/request";

export async function getCurrentUser() {
    return request.get<any, UserVO>('/user/current');
}

export async function updateUserProfile(updateRequest: UserUpdateRequest) {
    return request.post<UserUpdateRequest, void>('/user/update', updateRequest);
}

export async function changePassword(changePasswordRequest: ChangePasswordRequest) {
    return request.post<ChangePasswordRequest, void>('/user/changePassword', changePasswordRequest);
}
