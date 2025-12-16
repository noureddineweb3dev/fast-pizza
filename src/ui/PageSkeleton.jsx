function PageSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-1/3 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="h-40 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
    </div>
  );
}

export default PageSkeleton;
