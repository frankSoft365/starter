import { Route as cardDetailRoute } from "@/routes/_protected/hc/categories.$cardId";

export default function CardDetail() {
  const { cardId } = cardDetailRoute.useParams();
  return (
    <div className="px-4 md:px-28 pt-8">
      <h1 className="text-5xl">{cardId}</h1>
    </div>
  );
}
