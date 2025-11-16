import * as React from "react";
import { Button as BaseButton, type ButtonProps } from "./ui/button";
import { cn } from "./ui/utils";

interface DarkBackgroundButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function DarkBackgroundButton({ 
  className, 
  variant = "outline",
  ...props 
}: DarkBackgroundButtonProps) {
  return (
    <BaseButton
      variant={variant}
      className={cn(
        "border-white text-white bg-transparent",
        "hover:bg-white hover:text-black hover:border-white",
        "focus:bg-white focus:text-black focus:border-white",
        "active:bg-white/90 active:text-black active:border-white/90",
        "transition-all duration-200 ease-in-out",
        "disabled:border-white/50 disabled:text-white/50 disabled:bg-transparent",
        "[&_svg]:transition-colors [&_svg]:duration-200",
        "shadow-sm hover:shadow-md",
        className
      )}
      {...props}
    />
  );
}