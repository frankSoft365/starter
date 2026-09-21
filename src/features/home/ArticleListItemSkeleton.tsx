export default function ArticleListItemSkeleton() {
  return (
    <div className="w-full h-42 grid grid-cols-5 gap-4 md:grid-cols-7 p-4">
      <div className="col-span-3 md:col-span-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          {/* avatar */}
          <div className="skeleton h-8 w-8 shrink-0 rounded-full"></div>
          {/* username and publishAt */}
          <div className="skeleton h-3 w-28"></div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-1/2"></div>
        </div>
      </div>
      <div className="col-span-2 flex items-center">
        <div className="skeleton w-full aspect-2/1"></div>
      </div>
    </div>
  );
}
