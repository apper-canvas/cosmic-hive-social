import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md", 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 active:scale-95 shadow-sm hover:shadow-md",
    secondary: "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50 active:scale-95 shadow-sm hover:shadow-md",
    outline: "border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500/50 hover:border-gray-400",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500/50",
    danger: "bg-error text-white hover:bg-error/90 focus:ring-error/50 active:scale-95 shadow-sm hover:shadow-md",
    success: "bg-success text-white hover:bg-success/90 focus:ring-success/50 active:scale-95 shadow-sm hover:shadow-md"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;