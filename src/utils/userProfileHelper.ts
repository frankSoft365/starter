import type { UserVO } from "../types/UserVO";
import request from "./request";

export type UserUpdateRequest = {
    username?: string;
    image?: string;
    email?: string;
}

export async function getUserProfile() {
    return request.get<any, UserVO>('/user/current');
}

export async function updateUserProfile(updateRequest: UserUpdateRequest) {
    return await request.post<UserUpdateRequest, void>('/user/update', updateRequest);
}
