import * as React from "react";

import { cn } from "@/lib/utils";

const InputCurrcency = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  return (
    <div className="relative flex">
      <p className="absolute top-2.5 left-2 text-xs ">Rp</p>
      <input
        type="number"
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 pt-0.5 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-700 disabled:cursor-not-allowed disabled:opacity-50 pl-8 ",
          className,
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
InputCurrcency.displayName = "Input";

export { InputCurrcency };
