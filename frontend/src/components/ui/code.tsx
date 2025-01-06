import { ReactNode } from "react";
import clsx from "clsx";

interface CodeProps {
  children: ReactNode; // Explicitly type the `children` prop
  className?: string; // Optional className prop for custom styling
}

export function Code({ children, className }: CodeProps): JSX.Element {
  return (
    <pre
      className={clsx(
        "bg-slate-800 text-slate-200 p-4 rounded-md overflow-x-auto font-mono text-sm",
        className
      )}
    >
      <code>{children}</code>
    </pre>
  );
}
