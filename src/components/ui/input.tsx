import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md text-sm ring-offset-black transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-gray-700 bg-gray-800/90 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm shadow-purple-500/10",
        frost:
          "border border-white/10 bg-white/5 backdrop-blur-md text-white placeholder:text-gray-400 focus:border-white/20 focus:bg-white/10 shadow-sm",
        neon: "border-2 border-green-500/50 bg-gray-900 text-green-400 placeholder:text-green-700 shadow-[0_0_10px_rgba(34,197,94,0.2)] focus:border-green-400 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] focus:text-green-300",
        gradient:
          "border-2 bg-gray-800 text-white placeholder:text-gray-400 border-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 focus:from-pink-600 focus:via-purple-600 focus:to-indigo-600",
        premium:
          "border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-lg shadow-amber-500/10",
        destructive:
          "border-2 border-red-500/50 bg-gray-800 text-white placeholder:text-red-200/30 focus:border-red-500 focus:ring-2 focus:ring-red-500 shadow-sm shadow-red-500/10",
        minimal:
          "border-0 bg-gray-800 text-white placeholder:text-gray-400 focus:bg-gray-700 focus:ring-0",
        glow: "border border-purple-400/30 bg-gray-800 text-white placeholder:text-gray-400 shadow-[0_0_10px_rgba(147,51,234,0.1)] focus:border-purple-400 focus:shadow-[0_0_15px_rgba(147,51,234,0.2)]",
      },
      inputSize: {
        default: "h-10 px-3 py-2",
        sm: "h-8 px-2 py-1 text-xs rounded-md",
        lg: "h-12 px-4 py-3 text-base rounded-md",
        xl: "h-14 px-6 py-4 text-lg rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

type InputVariantsProps = VariantProps<typeof inputVariants>;

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: InputVariantsProps["variant"];
  inputSize?: InputVariantsProps["inputSize"];
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

// Create a wrapper component for gradient border effect
const GradientWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-75 blur" />
      {children}
    </div>
  );
};

export { Input, inputVariants, GradientWrapper };
