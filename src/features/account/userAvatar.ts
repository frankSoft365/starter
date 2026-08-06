import { useRef, useState } from "react";
import type { UserVO } from "../../types/user";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadAvatarApi } from "../../services/apiUpload";
import i18n from "@/i18n";

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
                throw new Error(i18n.t('common.toast.noFileSelected'))
            }
            const formData = new FormData();
            formData.append('avatar', currentAvatarFile)
            return await uploadAvatarApi(formData);
        },
        onSuccess: () => {
            toast.success(i18n.t('settings.toast.avatarUploaded'));
        },
        onError: (_error) => {

        }
    })
    return ({
        uploadAvatar,
        isUploading
    });
}