import { Route as articleEditRoute } from "@/routes/_app/_protected/articles.edit.$articleId";
import { useCurrentArticle } from "./article";
import EditorComponent from "./EditorComponent";
import Loading from "./Loading";
import { useCreateBlockNote } from "@blocknote/react";

export default function ArticleEdit() {
    const { articleId } = articleEditRoute.useParams();
    const editor = useCreateBlockNote();

    const { article, isLoading } = useCurrentArticle(articleId, editor, true);

    return (
        <>
            {isLoading && <Loading />}
            {!isLoading && article && <>
                <EditorComponent
                    editor={editor}
                />
            </>}
        </>
    );
}