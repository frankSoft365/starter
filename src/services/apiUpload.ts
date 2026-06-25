import request from "../utils/request";

export async function uploadAvatar(params: FormData) {
    return request.post<FormData, string>('/upload/avatar', params);
}

export async function uploadImage(params: FormData) {
    return request.post<FormData, string>('/upload/image', params);
}

