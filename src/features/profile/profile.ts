import { getUserAbout, getUserProfile } from "@/services/apiUserProfile";
import { useQuery } from "@tanstack/react-query";

export function useUserAbout(userId: string) {
  return useQuery({
    queryKey: ["get-user-about", userId],
    queryFn: async () => {
      const userResult = await getUserAbout({ userId });
      return userResult.userResult;
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
