"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================
// Base Skeleton
// ============================================

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-lg bg-gray-200",
                className
            )}
            {...props}
        />
    );
}

// ============================================
// Card Skeleton
// ============================================

interface CardSkeletonProps {
    hasImage?: boolean;
    lines?: number;
    className?: string;
}

function CardSkeleton({ hasImage = false, lines = 3, className }: CardSkeletonProps) {
    return (
        <div className={cn("bg-white rounded-2xl border border-gray-100 p-6 space-y-4", className)}>
            {hasImage && (
                <Skeleton className="h-40 w-full rounded-xl" />
            )}
            <div className="space-y-3">
                <Skeleton className="h-5 w-3/4" />
                {Array.from({ length: lines }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className={cn("h-4", i === lines - 1 ? "w-1/2" : "w-full")}
                    />
                ))}
            </div>
        </div>
    );
}

// ============================================
// Table Skeleton
// ============================================

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
    className?: string;
}

function TableSkeleton({ rows = 5, columns = 4, className }: TableSkeletonProps) {
    return (
        <div className={cn("bg-white rounded-2xl border border-gray-100 overflow-hidden", className)}>
            {/* Header */}
            <div className="border-b border-gray-100 p-4">
                <div className="flex gap-4">
                    {Array.from({ length: columns }).map((_, i) => (
                        <Skeleton key={i} className="h-4 flex-1" />
                    ))}
                </div>
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div
                    key={rowIndex}
                    className={cn(
                        "flex gap-4 p-4",
                        rowIndex !== rows - 1 && "border-b border-gray-50"
                    )}
                >
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton
                            key={colIndex}
                            className={cn(
                                "h-4 flex-1",
                                colIndex === 0 && "w-1/4 flex-none"
                            )}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

// ============================================
// Profile Skeleton
// ============================================

function ProfileSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center gap-4", className)}>
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
            </div>
        </div>
    );
}

// ============================================
// Form Skeleton
// ============================================

interface FormSkeletonProps {
    fields?: number;
    className?: string;
}

function FormSkeleton({ fields = 4, className }: FormSkeletonProps) {
    return (
        <div className={cn("space-y-6", className)}>
            {Array.from({ length: fields }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                </div>
            ))}
            <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
    );
}

// ============================================
// Stats Card Skeleton
// ============================================

function StatsCardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("bg-white rounded-2xl border border-gray-100 p-6", className)}>
            <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
        </div>
    );
}

// ============================================
// Chart Skeleton
// ============================================

function ChartSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("bg-white rounded-2xl border border-gray-100 p-6", className)}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
                <div className="flex items-end gap-2 h-48">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            className="flex-1 rounded-t-lg"
                            style={{ height: `${Math.random() * 60 + 40}%` }}
                        />
                    ))}
                </div>
                <div className="flex justify-between">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <Skeleton key={i} className="h-3 w-8" />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================
// List Skeleton
// ============================================

interface ListSkeletonProps {
    items?: number;
    hasAvatar?: boolean;
    className?: string;
}

function ListSkeleton({ items = 5, hasAvatar = true, className }: ListSkeletonProps) {
    return (
        <div className={cn("space-y-3", className)}>
            {Array.from({ length: items }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100"
                >
                    {hasAvatar && <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />}
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
            ))}
        </div>
    );
}

// ============================================
// Dashboard Grid Skeleton
// ============================================

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <StatsCardSkeleton key={i} />
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartSkeleton />
                <ChartSkeleton />
            </div>

            {/* Table */}
            <TableSkeleton rows={5} columns={5} />
        </div>
    );
}

export {
    Skeleton,
    CardSkeleton,
    TableSkeleton,
    ProfileSkeleton,
    FormSkeleton,
    StatsCardSkeleton,
    ChartSkeleton,
    ListSkeleton,
    DashboardSkeleton,
};
