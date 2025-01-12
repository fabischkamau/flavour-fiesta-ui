import React from "react";

type LabelProps = {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
  srOnly?: boolean;
};

const Label = ({
  htmlFor,
  children,
  required = false,
  className = "",
  srOnly = false,
}: LabelProps) => {
  const baseStyles = "text-sm font-medium transition-colors";
  const visibilityStyles = srOnly ? "sr-only" : "block";
  const requiredStyles = required
    ? "after:content-['*'] after:ml-0.5 after:text-red-400"
    : "";

  return (
    <label
      htmlFor={htmlFor}
      className={`
        ${baseStyles}
        ${visibilityStyles}
        ${requiredStyles}
        ${className}
      `}
    >
      {children}
    </label>
  );
};

export default Label;
