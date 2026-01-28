"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

const inputVariants = cva(
    "flex w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "border-gray-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
                error:
                    "border-red-500 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20",
                success:
                    "border-green-500 focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/20",
                ghost:
                    "border-transparent bg-gray-50 focus-visible:bg-white focus-visible:border-primary",
            },
            inputSize: {
                default: "h-11",
                sm: "h-9 text-xs px-3",
                lg: "h-12 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            inputSize: "default",
        },
    }
);

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
    label?: string;
    error?: string;
    success?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type,
            variant,
            inputSize,
            label,
            error,
            success,
            hint,
            leftIcon,
            rightIcon,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const isPassword = type === "password";

        const currentVariant = error ? "error" : success ? "success" : variant;

        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium text-gray-700">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        type={isPassword && showPassword ? "text" : type}
                        className={cn(
                            inputVariants({ variant: currentVariant, inputSize, className }),
                            leftIcon && "pl-10",
                            (rightIcon || isPassword || error || success) && "pr-10"
                        )}
                        ref={ref}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    )}
                    {!isPassword && error && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                    {!isPassword && success && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                    {!isPassword && !error && !success && rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-xs text-green-500 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {success}
                    </p>
                )}
                {hint && !error && !success && (
                    <p className="text-xs text-gray-500">{hint}</p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input, inputVariants };
