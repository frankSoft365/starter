import request from "../utils/request";

export async function uploadAvatarApi(params: FormData) {
    return request.post<FormData, string>('/upload/avatar', params);
}

export async function uploadImageApi(params: FormData) {
    return request.post<FormData, string>('/upload/image', params);
}

