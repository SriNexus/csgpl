import { cn } from "@/utils/cn";

/** Reusable shimmer skeleton block. */
export default function Skeleton({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-md bg-gray-100 relative overflow-hidden",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
        "before:animate-[shimmer_1.4s_infinite]",
        className
      )}
      {...rest}
    />
  );
}
