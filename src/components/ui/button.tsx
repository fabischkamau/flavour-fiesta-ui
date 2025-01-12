import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Enhanced default with gradient
        default:
          "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/20",

        // Vibrant destructive
        destructive:
          "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/20",

        // Neon-inspired outline
        outline:
          "border-2 border-cyan-500 bg-transparent text-cyan-400 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-400 shadow-lg shadow-cyan-500/20",

        // Cool secondary with subtle gradient
        secondary:
          "bg-gradient-to-r from-gray-700 to-slate-700 text-gray-100 hover:from-gray-600 hover:to-slate-600 shadow-md shadow-gray-700/20",

        // Enhanced ghost with glow effect
        ghost:
          "bg-transparent text-gray-300 hover:bg-gray-800/50 hover:text-white backdrop-blur-sm",

        // Glowing link style
        link: "text-purple-400 underline-offset-4 hover:text-purple-300 hover:underline transition-colors",

        // New gradient style
        gradient:
          "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 shadow-lg shadow-purple-500/20",

        // New frost style
        frost:
          "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all",

        // New neon style
        neon: "bg-transparent border-2 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_25px_rgba(34,197,94,0.7)] hover:text-green-300 transition-all",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        xl: "h-12 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
