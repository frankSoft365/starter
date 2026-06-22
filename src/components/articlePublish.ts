import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useArticlePublish() {

    const { mutate: handlePublish, isPending: isPublishing } = useMutation({
        mutationKey: ['publish-article'],
        mutationFn: async (_value: any) => {
            // await publishArticle(insertArticle);
        },
        onSuccess() {
            toast.success('Article published successfully.');
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred while publishing the article.');
        }
    });

    return ({
        handlePublish,
        isPublishing,
    });

}