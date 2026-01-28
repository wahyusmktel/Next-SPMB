"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default: "bg-primary/10 text-primary",
                secondary: "bg-secondary/10 text-secondary",
                success: "bg-emerald-100 text-emerald-700",
                warning: "bg-amber-100 text-amber-700",
                error: "bg-red-100 text-red-700",
                info: "bg-blue-100 text-blue-700",
                outline: "border border-gray-200 text-gray-600",
                // Status badges
                draft: "bg-gray-100 text-gray-700",
                submitted: "bg-blue-100 text-blue-700",
                pending: "bg-yellow-100 text-yellow-700",
                verified: "bg-green-100 text-green-700",
                accepted: "bg-emerald-100 text-emerald-700",
                rejected: "bg-red-100 text-red-700",
            },
            size: {
                default: "px-2.5 py-0.5 text-xs",
                sm: "px-2 py-0.5 text-[10px]",
                lg: "px-3 py-1 text-sm",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
    dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
            {dot && (
                <span
                    className={cn(
                        "mr-1.5 h-1.5 w-1.5 rounded-full",
                        {
                            "bg-primary": variant === "default",
                            "bg-secondary": variant === "secondary",
                            "bg-emerald-500": variant === "success" || variant === "accepted" || variant === "verified",
                            "bg-amber-500": variant === "warning" || variant === "pending",
                            "bg-red-500": variant === "error" || variant === "rejected",
                            "bg-blue-500": variant === "info" || variant === "submitted",
                            "bg-gray-500": variant === "outline" || variant === "draft",
                        }
                    )}
                />
            )}
            {children}
        </span>
    );
}

export { Badge, badgeVariants };
