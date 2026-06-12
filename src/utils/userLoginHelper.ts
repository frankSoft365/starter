import request from "./request";

export async function userLogout() {
    const { data } = await request.post('/user/logout');
    return data;
}