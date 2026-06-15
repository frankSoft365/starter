import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getUserProfile, updateUserProfile, type UserUpdateRequest } from "../utils/userProfileHelper";
import { useSetAtom } from "jotai";
import { isLoginAtom, userAtom } from "../stores/user";
import { toast } from "sonner";
import type { UserVO } from "../types/UserVO";
import type { Dispatch, SetStateAction } from "react";
import request from "../utils/request";
import { SilentBizError } from "../types/SilentBizError";

export function useUserProfile() {
    const setUserInfo = useSetAtom(userAtom);
    const setIsLogin = useSetAtom(isLoginAtom);

    const { data: user, isLoading: isUserProfileLoading, isError: isLoadingError } = useQuery({
        queryKey: ['get-user-profile'],
        queryFn: async () => {
            const userInfo = await getUserProfile();
            if (userInfo) {
                setUserInfo(userInfo);
                setIsLogin(true);
                return userInfo;
            }
            throw new Error('Failed to retrieve user information');
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
    currentAvatarFile: File | null,
    isRemoveAvatar: boolean
) {
    const [username, setUsername] = useState<string>(user.username);
    const [image, setImage] = useState<string | undefined>(user.image || undefined);

    const queryClient = useQueryClient();

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
                // TODO: upload avatar
                const formData = new FormData();
                formData.append('avatar', currentAvatarFile)
                const { data } = await request.post('/upload', formData);
                if (data.code !== 0) {
                    throw new SilentBizError();
                }
                newAvatarURL = data.data;
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
            const data = await updateUserProfile(updateRequest);
            if (data.code !== 0) {
                throw new SilentBizError();
            }
        },
        onSuccess: () => {
            toast.success('update successfully');
            queryClient.invalidateQueries({ queryKey: ['get-user-profile'] });
            setIsModalOpen(false);
        },
        onError: (error) => {
            if (error instanceof SilentBizError) {
                return;
            }
            toast.error(error.message);
        }
    })
    return ({
        username,
        setUsername,
        image,
        setImage,
        isUpdating,
        handleUpdate
    });
}