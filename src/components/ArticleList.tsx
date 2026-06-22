import ArticleListItem from "./ArticleListItem";
import { useQuery } from "@tanstack/react-query";
import { getArticleList } from "../services/apiArticle";
import Loading from "./Loading";

export default function ArticleList() {

    const { data: articleList, isLoading, isError } = useQuery({
        queryKey: ['get-article-list'],
        queryFn: async () => {
            return await getArticleList({});
        },

    });
    return (
        <>
            {isLoading && <Loading />}
            {!isLoading && <ul className="list bg-base-100 rounded-box shadow-md">
                {articleList && articleList.map((article) => {
                    return (
                        <ArticleListItem article={article} />
                    );
                })}
            </ul>}
        </>
    );
}