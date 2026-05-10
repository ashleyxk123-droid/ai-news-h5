export function NewsCardSkeleton() {
  return (
    <div className="p-4 border-b border-app-border md:border md:rounded-xl md:shadow-sm skeleton-pulse">
      <div className="h-4 bg-app-skeleton rounded w-3/4 mb-2" />
      <div className="h-3 bg-app-skeleton rounded w-full mb-1" />
      <div className="h-3 bg-app-skeleton rounded w-2/3 mb-3" />
      <div className="flex items-center gap-2">
        <div className="h-3 bg-app-skeleton rounded w-16" />
        <div className="h-3 bg-app-skeleton rounded w-12" />
      </div>
    </div>
  );
}
