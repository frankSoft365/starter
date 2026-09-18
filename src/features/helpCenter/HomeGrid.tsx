import HomeGridCard from "./HomeGridCard";

export default function HomeGrid() {
  return (
    <div className="w-5/6 mt-4 m-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <HomeGridCard />
      <HomeGridCard />
      <HomeGridCard />
      <HomeGridCard />
      <HomeGridCard />
      <HomeGridCard />
      <HomeGridCard />
    </div>
  );
}
