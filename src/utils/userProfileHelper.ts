import type { UserVO } from "../types/UserVO";
import request from "./request";

export type UserUpdateRequest = {
    id: string;
    username: string;
    image?: string;
    email: string;
}

export async function getUserProfile() {
    const { data } = await request.get('/user/current');
    if (data.code === 0) {
        return data.data as UserVO;
    }
    throw new Error('Failed to retrieve user information');
}

export async function updateUserProfile(updateRequest: UserUpdateRequest) {
    const { data } = await request.post('/user/update', updateRequest);
    return data;
}
