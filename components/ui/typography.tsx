import React from "react";
import { cn } from "@/lib/utils";

export const H1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
H1.displayName = "TypographyH1";
