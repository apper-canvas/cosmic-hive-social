import React from "react";
import { cn } from "@/utils/cn";

const Textarea = React.forwardRef(({ 
  className, 
  error,
  rows = 4,
  ...props 
}, ref) => {
  return (
    <textarea
      className={cn(
        "flex w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm transition-colors",
        "placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
        "disabled:cursor-not-allowed disabled:opacity-50 resize-vertical",
        error && "border-error focus:border-error focus:ring-error/20",
        className
      )}
      rows={rows}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;