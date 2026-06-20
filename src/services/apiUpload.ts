import request from "../utils/request";

export async function uploadImage(params: FormData) {
    return request.post<FormData, string>('/upload', params);
}