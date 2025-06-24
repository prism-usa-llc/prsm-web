import { ReactNode } from "react";
import { clsx } from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export default function Card({
  children,
  className,
  padding = "md",
}: CardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={clsx(
        "bg-gray-800 rounded-lg border border-green-500/30 shadow-lg hover:shadow-xl hover:border-green-400/50 transition-all duration-200",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
