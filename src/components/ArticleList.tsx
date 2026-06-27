import ArticleListItem from "./ArticleListItem";
import { useQuery } from "@tanstack/react-query";
import { getArticleList } from "../services/apiArticle";
import Loading from "../ui/Loading";
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
                        <Link key={article.id} to={Route.to} params={{ articleId: article.id }}>
                            <ArticleListItem
                                article={article}
                            />
                        </Link>
                    );
                })}
            </ul>}
        </>
    );
}