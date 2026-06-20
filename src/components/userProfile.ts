import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { changePassword, getCurrentUser, updateUserProfile } from "../services/apiUserProfile";
import { useSetAtom } from "jotai";
import { isLoginAtom, userAtom } from "../atoms/user";
import { toast } from "sonner";
import type { UserUpdateRequest, UserVO } from "../types/user";
import type { Dispatch, SetStateAction } from "react";
import { useUploadAvatar } from "./userAvatar";
import { useUserLogout } from "./userLogin";

export function useUserProfile() {
    const setUserInfo = useSetAtom(userAtom);
    const setIsLogin = useSetAtom(isLoginAtom);

    const { data: user, isLoading: isUserProfileLoading, isError: isLoadingError } = useQuery({
        queryKey: ['get-user-profile'],
        queryFn: async () => {
            const userInfo = await getCurrentUser();
            setUserInfo(userInfo);
            setIsLogin(true);
            return userInfo;
        }
    })

    return ({
        user,
        isUserProfileLoading,
        isLoadingError,
    });
}

export function useUserUpdate(
    user: UserVO,
    setIsModalOpen: Dispatch<SetStateAction<boolean>>,
    currentAvatarFile: File | null
) {
    const [isRemoveAvatar, setIsRemoveAvatar] = useState(false);
    const [username, setUsername] = useState<string>(user.username);

    const queryClient = useQueryClient();

    const { uploadAvatar, isUploading } = useUploadAvatar(currentAvatarFile);

    const { isPending: isUpdating, mutate: handleUpdate } = useMutation({
        mutationFn: async () => {
            let newUserName = '';
            let newAvatarURL = '';

            if (!username.length) {
                throw new Error('Name is required');
            }
            if (username !== user.username) {
                newUserName = username;
            }
            if (!newUserName && !currentAvatarFile && !isRemoveAvatar) {
                throw new Error('Nothing to update');
            }
            if (currentAvatarFile) {
                const avatarURL = await uploadAvatar();
                newAvatarURL = avatarURL;
            }
            let updateRequest: UserUpdateRequest | null = null;
            if (isRemoveAvatar) {
                updateRequest = {
                    ...(newUserName && { username: newUserName }),
                    image: '',
                }
            } else {
                updateRequest = {
                    ...(newUserName && { username: newUserName }),
                    ...(newAvatarURL && { image: newAvatarURL })
                }
            }
            await updateUserProfile(updateRequest);
        },
        onSuccess: () => {
            toast.success('update successfully');
            queryClient.invalidateQueries({ queryKey: ['get-user-profile'] });
            setIsModalOpen(false);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
    return ({
        username,
        setUsername,
        isUpdating,
        handleUpdate,
        setIsRemoveAvatar,
        isUploading
    });
}

export function useChangePassword() {
    const { userLogout } = useUserLogout();

    const { isPending: isChanging, mutate: handleChangePassword } = useMutation({
        mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string, newPassword: string }) => {
            if (currentPassword === newPassword) {
                throw new Error('The old and new passwords are the same.');
            }
            await changePassword({ currentPassword, newPassword });
        },
        onSuccess: () => {
            toast.success('Password changed successfully');
            userLogout();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
    return ({
        isChanging,
        handleChangePassword,
    });
}