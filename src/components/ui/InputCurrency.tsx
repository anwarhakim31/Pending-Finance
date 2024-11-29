import * as React from "react";

import { cn } from "@/lib/utils";

const InputCurrcency = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  return (
    <div className="relative">
      <p className="absolute top-2 left-2 text-sm text-gray-500">Rp</p>
      <input
        type="number"
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-700 disabled:cursor-not-allowed disabled:opacity-50 pl-8 ",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
InputCurrcency.displayName = "Input";

export { InputCurrcency };
