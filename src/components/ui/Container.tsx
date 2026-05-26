import { cn } from "@/utils/cn";
import { container } from "@/design/tokens";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: "base" | "narrow" | "prose";
};

/**
 * Container — applies the canonical max-width + horizontal padding.
 * Use inside `<Section>` or anywhere centered constrained content is needed.
 */
export default function Container({
  size = "base",
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <div className={cn(container[size], className)} {...rest}>
      {children}
    </div>
  );
}
