import type {
  ChangePasswordRequest,
  UserAboutQuery,
  UserProfileQuery,
  UserResult,
  UserUpdateAboutRequest,
  UserUpdateRequest,
  UserVO,
} from "../types/user";
import request from "../utils/request";

export async function getCurrentUser() {
  return request.get<any, UserVO>("/user/current");
}

export async function getSomeUser(userId: string) {
  return request.get<void, UserVO>("/user/some", { params: { userId } });
}

export async function updateUserProfile(updateRequest: UserUpdateRequest) {
  return request.post<UserUpdateRequest, void>("/user/update", updateRequest);
}

export async function changePassword(
  changePasswordRequest: ChangePasswordRequest,
) {
  return request.post<ChangePasswordRequest, void>(
    "/user/changePassword",
    changePasswordRequest,
  );
}

export async function getUserAbout(userAboutQuery: UserAboutQuery) {
  return request.post<UserAboutQuery, UserResult>(
    "/user/profile/about",
    userAboutQuery,
  );
}

export async function getUserProfile(userProfileQuery: UserProfileQuery) {
  return request.post<UserProfileQuery, UserResult>(
    "/user/profile/container",
    userProfileQuery,
  );
}

export async function userUpdateAbout(req: UserUpdateAboutRequest) {
  return request.post<UserUpdateAboutRequest, void>(
    "/user/profile/about/update",
    req,
  );
}
