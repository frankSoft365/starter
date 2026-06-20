import type { SendCodeRequest, UserRegisterRequest, VerifyCodeRequest } from "../types/user";
import request from "../utils/request";

export async function getVerificationCode(sendCodeRequest: SendCodeRequest) {
    return await request.post<SendCodeRequest, void>('/emailVerify/getVerificationCode', sendCodeRequest);
}

export async function verifyVerificationCode(verifyCodeRequest: VerifyCodeRequest) {
    return await request.post<VerifyCodeRequest, string>('/emailVerify/verifyVerificationCode', verifyCodeRequest);
}

export async function userRegister(userRegisterRequest: UserRegisterRequest) {
    return await request.post<UserRegisterRequest, string>('/user/register', userRegisterRequest);
}

