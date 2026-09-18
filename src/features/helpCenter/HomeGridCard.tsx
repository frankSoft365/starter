import { Route } from "@/routes/_protected/hc/categories.$cardId";
import { useNavigate } from "@tanstack/react-router";

export default function HomeGridCard() {
  const navigate = useNavigate();
  function linkToCardDetail() {
    navigate({ to: Route.to, params: { cardId: "1" } });
  }
  return (
    <div className="card bg-base-100 shadow-sm">
      <figure>
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Card Title</h2>
        <p>
          A card component has a figure, a body part, and inside body there are
          title and actions parts
        </p>
        <div className="card-actions justify-end">
          <button onClick={linkToCardDetail} className="btn btn-primary">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
