"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectProps {
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    searchable?: boolean;
    clearable?: boolean;
    className?: string;
}

export function Select({
    options,
    value,
    onChange,
    placeholder = "Pilih opsi...",
    label,
    error,
    disabled,
    searchable = false,
    clearable = false,
    className,
}: SelectProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    const filteredOptions = searchable
        ? options.filter((opt) =>
            opt.label.toLowerCase().includes(search.toLowerCase())
        )
        : options;

    // Close on click outside
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange?.(optionValue);
        setIsOpen(false);
        setSearch("");
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.("");
    };

    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}

            {/* Trigger */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    "flex items-center justify-between w-full h-11 px-4 rounded-xl border bg-white text-sm transition-all duration-200",
                    isOpen
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-gray-200 hover:border-gray-300",
                    error && "border-red-500 focus:ring-red-500/20",
                    disabled && "opacity-50 cursor-not-allowed bg-gray-50"
                )}
            >
                <span className={cn(!selectedOption && "text-gray-400")}>
                    {selectedOption?.label || placeholder}
                </span>
                <div className="flex items-center gap-1">
                    {clearable && value && (
                        <button
                            onClick={handleClear}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="h-3 w-3 text-gray-400" />
                        </button>
                    )}
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 text-gray-400 transition-transform duration-200",
                            isOpen && "rotate-180"
                        )}
                    />
                </div>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden"
                    >
                        {/* Search */}
                        {searchable && (
                            <div className="p-2 border-b border-gray-100">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari..."
                                        className="w-full h-9 pl-9 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        {/* Options */}
                        <div className="max-h-60 overflow-y-auto py-1">
                            {filteredOptions.length === 0 ? (
                                <p className="px-4 py-3 text-sm text-gray-500 text-center">
                                    Tidak ada data
                                </p>
                            ) : (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => !option.disabled && handleSelect(option.value)}
                                        disabled={option.disabled}
                                        className={cn(
                                            "flex items-center justify-between w-full px-4 py-2.5 text-sm text-left transition-colors",
                                            option.value === value
                                                ? "bg-primary/5 text-primary"
                                                : "hover:bg-gray-50",
                                            option.disabled && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        {option.label}
                                        {option.value === value && (
                                            <Check className="h-4 w-4 text-primary" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <p className="mt-1.5 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}

// ============================================
// Multi Select
// ============================================

interface MultiSelectProps {
    options: SelectOption[];
    value?: string[];
    onChange?: (value: string[]) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    searchable?: boolean;
    className?: string;
}

export function MultiSelect({
    options,
    value = [],
    onChange,
    placeholder = "Pilih opsi...",
    label,
    error,
    disabled,
    searchable = false,
    className,
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);

    const selectedOptions = options.filter((opt) => value.includes(opt.value));

    const filteredOptions = searchable
        ? options.filter((opt) =>
            opt.label.toLowerCase().includes(search.toLowerCase())
        )
        : options;

    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggle = (optionValue: string) => {
        const newValue = value.includes(optionValue)
            ? value.filter((v) => v !== optionValue)
            : [...value, optionValue];
        onChange?.(newValue);
    };

    const handleRemove = (optionValue: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.(value.filter((v) => v !== optionValue));
    };

    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    "flex items-center gap-2 flex-wrap min-h-[44px] w-full px-3 py-2 rounded-xl border bg-white text-sm transition-all duration-200",
                    isOpen
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-gray-200 hover:border-gray-300",
                    error && "border-red-500",
                    disabled && "opacity-50 cursor-not-allowed bg-gray-50"
                )}
            >
                {selectedOptions.length === 0 ? (
                    <span className="text-gray-400">{placeholder}</span>
                ) : (
                    selectedOptions.map((opt) => (
                        <span
                            key={opt.value}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg"
                        >
                            {opt.label}
                            <button
                                onClick={(e) => handleRemove(opt.value, e)}
                                className="hover:bg-primary/20 rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))
                )}
                <ChevronDown
                    className={cn(
                        "ml-auto h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden"
                    >
                        {searchable && (
                            <div className="p-2 border-b border-gray-100">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari..."
                                        className="w-full h-9 pl-9 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        <div className="max-h-60 overflow-y-auto py-1">
                            {filteredOptions.length === 0 ? (
                                <p className="px-4 py-3 text-sm text-gray-500 text-center">
                                    Tidak ada data
                                </p>
                            ) : (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleToggle(option.value)}
                                        className={cn(
                                            "flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors hover:bg-gray-50"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "h-4 w-4 rounded border-2 flex items-center justify-center transition-colors",
                                                value.includes(option.value)
                                                    ? "bg-primary border-primary"
                                                    : "border-gray-300"
                                            )}
                                        >
                                            {value.includes(option.value) && (
                                                <Check className="h-3 w-3 text-white" />
                                            )}
                                        </div>
                                        {option.label}
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>
    );
}
