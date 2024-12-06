import * as React from "react";

import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const InputPassword = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative  w-full">
      <input
        type={visible ? "text" : "password"}
        className={cn(
          "flex h-9 w-full overflow-hidden rounded-md border border-input bg-transparent px-3 py-1 pr-8 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-700 disabled:cursor-not-allowed disabled:opacity-50 ",
          className
        )}
        ref={ref}
        {...props}
      />
      <button
        type="button"
        aria-label="toggle password visibility"
        className="absolute right-0 top-1/2 -translate-y-1/2 hover:bg-violet-100 transition-all duration-300 ease-in-out rounded-sm p-2 "
        onClick={() => setVisible((prev) => !prev)}
      >
        {visible ? (
          <EyeIcon size={18} strokeWidth={1.5} />
        ) : (
          <EyeOffIcon size={18} strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
});
InputPassword.displayName = "Input";

export { InputPassword };
