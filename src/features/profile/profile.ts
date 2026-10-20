import {
  getUserAbout,
  getUserProfile,
  userUpdateAbout,
} from "@/services/apiUserProfile";
import type { BlockNoteEditor } from "@blocknote/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUserAbout(userId: string, editor: BlockNoteEditor) {
  return useQuery({
    queryKey: ["get-user-about", userId],
    queryFn: async () => {
      const userResult = await getUserAbout({ userId });
      const userInfo = userResult.userResult;
      if (userInfo.about) {
        const about = JSON.parse(userInfo.about);
        editor.replaceBlocks(editor.document, about);
      }
      return userInfo;
    },
  });
}

export function useUserProfileContainer(userId: string) {
  return useQuery({
    queryKey: ["get-user-profile-container", userId],
    queryFn: async () => {
      const userResult = await getUserProfile({ userId });
      return userResult.userResult;
    },
  });
}

export function useUserUpdateAbout(userId: string) {
  const queryClient = useQueryClient();
  const { isPending: isSaving, mutate: handleUpdateAbout } = useMutation({
    mutationKey: ["user-update-about"],
    mutationFn: async ({ about }: { about: string }) => {
      await userUpdateAbout({ about });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-user-about", userId],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return {
    handleUpdateAbout,
    isSaving,
  };
}
