import { cn } from "@/utils/cn";

type LeadProps = React.HTMLAttributes<HTMLParagraphElement> & {
  invert?: boolean;
};

/**
 * Lead — paragraph for section sub-text. Caps at ~60ch for readability.
 */
export default function Lead({ invert = false, className, children, ...rest }: LeadProps) {
  return (
    <p
      className={cn("lead", invert && "text-white/70", className)}
      {...rest}
    >
      {children}
    </p>
  );
}
