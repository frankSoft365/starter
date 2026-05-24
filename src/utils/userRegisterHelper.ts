import request from "./request";

export type UserRegisterRequest = {
    token: string;
    username: string;
    password: string;
}

export type SendCodeRequest = {
    email: string;
}

export type VerifyCodeRequest = {
    email: string;
    verifyCode: string;
}

export async function getVerificationCode(sendCodeRequest: SendCodeRequest) {
    const { data } = await request.post('/emailVerify/getVerificationCode', sendCodeRequest);
    return data.code === 0;
}

export async function verifyVerificationCode(verifyCodeRequest: VerifyCodeRequest) {
    const { data } = await request.post('/emailVerify/verifyVerificationCode', verifyCodeRequest);
    return data;
}

export async function userRegister(userRegisterRequest: UserRegisterRequest) {
    const { data } = await request.post('/user/register', userRegisterRequest);
    return data;
}

