import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getUserProfile, updateUserProfile, type UserUpdateRequest } from "../utils/userProfileHelper";
import { useSetAtom } from "jotai";
import { isLoginAtom, userAtom } from "../stores/user";
import { toast } from "sonner";

export function useUserProfile() {
    const setUserInfo = useSetAtom(userAtom);
    const setIsLogin = useSetAtom(isLoginAtom);
    const [username, setUsername] = useState<string>('');
    const [image, setImage] = useState<string | undefined>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();

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
    const { isPending: isUpdating, mutate: handleUpdate } = useMutation({
        mutationFn: async () => {
            if (!user) {
                throw new Error('Failed to retrieve user information')
            }
            const updateRequest: UserUpdateRequest = {
                id: user.id,
                username: username,
                image: image,
                email: user.email
            }
            const data = await updateUserProfile(updateRequest);
            if (data.code !== 0) {
                throw new Error('Update failed');
            }
        },
        onSuccess: () => {
            toast.success('update successfully');
            queryClient.invalidateQueries({ queryKey: ['get-user-profile'] });
            setIsModalOpen(false);
        },
        onError: (error) => {
            console.log('error : ', error.message);
            toast.error('Update failed');
        }
    })

    return ({
        username,
        setUsername,
        image,
        setImage,
        isModalOpen,
        setIsModalOpen,
        user,
        isUserProfileLoading,
        isLoadingError,
        isUpdating,
        handleUpdate
    });
}