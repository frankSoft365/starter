import ArticleListItem from "./ArticleListItem";
import { useQuery } from "@tanstack/react-query";
import { getArticleList } from "../services/apiArticle";
import Loading from "./Loading";
import { Link } from "@tanstack/react-router";
import { Route } from "../routes/_app/article.$articleId";

export default function ArticleList() {

    const { data: articleList, isLoading } = useQuery({
        queryKey: ['get-article-list'],
        queryFn: async () => {
            return await getArticleList({});
        },
    });
    return (
        <>
            {isLoading && <Loading />}
            {!isLoading && <ul className="list w-3xl bg-base-100 shadow-md">
                {articleList && articleList.map((article) => {
                    return (
                        <Link to={Route.to} params={{ articleId: article.id }}>
                            <ArticleListItem
                                key={article.id}
                                article={article}
                            />
                        </Link>
                    );
                })}
            </ul>}
        </>
    );
}