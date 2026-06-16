import { useRef, useState } from "react";
import type { UserVO } from "../types/UserVO";
import { useMutation } from "@tanstack/react-query";
import request from "../utils/request";
import { toast } from "sonner";

export function useChangeAvatar(user: UserVO) {
    const imageUploadRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<string | undefined>(user.image || undefined);
    const [currentAvatarFile, setCurrentAvatarFile] = useState<File | null>(null);

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files![0];
        const url = URL.createObjectURL(file);
        setImage(url);
        setCurrentAvatarFile(file);
    }

    return ({
        imageUploadRef,
        image,
        setImage,
        handleImageChange,
        currentAvatarFile
    });
}

export function useUploadAvatar(currentAvatarFile: File | null) {
    const { isPending: isUploading, mutateAsync: uploadAvatar } = useMutation({
        mutationFn: async () => {
            if (!currentAvatarFile) {
                throw new Error('No file selected')
            }
            const formData = new FormData();
            formData.append('avatar', currentAvatarFile)
            return await request.post<FormData, string>('/upload', formData);
        },
        onSuccess: () => {
            toast.success('Avatar uploaded successfully');
        },
        onError: (_error) => {

        }
    })
    return ({
        uploadAvatar,
        isUploading
    });
}