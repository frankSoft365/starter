import type { UserVO } from "../types/UserVO";
import request from "./request";

export type UserUpdateRequest = {
    username?: string;
    image?: string;
    email?: string;
}

export async function getUserProfile() {
    const res = await request.get('/user/current');
    if (res) {
        const data = res.data;
        if (data.code === 0) {
            return res.data.data as UserVO;
        }
    }
    return undefined;
}

export async function updateUserProfile(updateRequest: UserUpdateRequest) {
    const { data } = await request.post('/user/update', updateRequest);
    return data;
}
