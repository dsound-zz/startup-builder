"use client";

import { ReactNode, forwardRef } from "react";
import React from "react";

export interface ButtonProps {
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg" | "icon";
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className,
  type = "button",
  variant = "default",
  size = "default",
  disabled,
  onClick
}, ref) => {
  const baseClasses = "rounded-md font-medium transition-colors";
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "hover:bg-gray-100 text-gray-700"
  };
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
    icon: "p-2"
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ""}`;

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
});

ButtonComponent.displayName = "Button";

export const Button = ButtonComponent;
