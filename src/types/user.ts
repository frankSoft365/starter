import type { ChangePasswordForm } from "@/schemas/account";
import type { LoginForm } from "@/schemas/auth";
import type { SocialStats } from "./follow";

export type UserVO = {
  id: string;
  username: string;
  email: string;
  role: string;
  image: string | null;
  createTime: Date;
  followerCount: number;
  followingCount: number;
};

export type UserUpdateRequest = {
  username?: string;
  image?: string;
};

export type ChangePasswordRequest = ChangePasswordForm;

export type UserLoginRequest = LoginForm;

export type UserRegisterRequest = {
  token: string;
  username: string;
  password: string;
};

export type SendCodeRequest = {
  email: string;
};

export type VerifyCodeRequest = {
  email: string;
  verifyCode: string;
};

export type UserAboutQuery = {
  userId: string;
};

export type UserProfileQuery = {
  userId: string;
};

export type Membership = {
  memberSince: Date;
};

export type UserInfo = {
  id: string;
  username: string;
  socialStats: SocialStats;
  membership: Membership;
  bio: string;
  avatar: string;
  about: string;
};

export type UserResult = {
  userResult: UserInfo;
};
