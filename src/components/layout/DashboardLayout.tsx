"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    GraduationCap,
    LayoutDashboard,
    FileText,
    Bell,
    User,
    LogOut,
    Menu,
    X,
    ChevronDown,
    ClipboardList,
    MessageSquare,
    Settings,
    HelpCircle,
    Home,
    School,
    Users,
    BarChart3,
    FileSpreadsheet,
    Megaphone,
    Newspaper,
    Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore, useUIStore, useNotificationStore } from "@/lib/store";
import type { UserRole } from "@/data/types";

// ============================================
// Menu Configuration by Role
// ============================================

interface MenuItem {
    icon: React.ElementType;
    label: string;
    href: string;
    badge?: number;
}

interface MenuGroup {
    title?: string;
    items: MenuItem[];
}

const getMenuByRole = (role: UserRole): MenuGroup[] => {
    switch (role) {
        case "super_admin":
            return [
                {
                    items: [{ icon: LayoutDashboard, label: "Dashboard", href: "/super-admin" }],
                },
                {
                    title: "Manajemen",
                    items: [
                        { icon: Home, label: "Dinas Pendidikan", href: "/super-admin/dinas" },
                        { icon: School, label: "Sekolah", href: "/super-admin/sekolah" },
                        { icon: Users, label: "Pengguna", href: "/super-admin/users" },
                    ],
                },
                {
                    title: "Monitoring",
                    items: [
                        { icon: BarChart3, label: "Statistik", href: "/super-admin/stats" },
                        { icon: FileSpreadsheet, label: "Laporan", href: "/super-admin/reports" },
                    ],
                },
            ];
        case "admin_dinas":
            return [
                {
                    items: [{ icon: LayoutDashboard, label: "Dashboard", href: "/admin-dinas" }],
                },
                {
                    title: "Konfigurasi",
                    items: [
                        { icon: Settings, label: "Pengaturan", href: "/admin-dinas/settings" },
                        { icon: School, label: "Data Sekolah", href: "/admin-dinas/sekolah" },
                        { icon: ClipboardList, label: "Jalur Pendaftaran", href: "/admin-dinas/jalur" },
                    ],
                },
                {
                    title: "Monitoring",
                    items: [
                        { icon: BarChart3, label: "Statistik", href: "/admin-dinas/monitoring" },
                        { icon: Users, label: "Admin Sekolah", href: "/admin-dinas/users" },
                    ],
                },
                {
                    title: "Informasi",
                    items: [
                        { icon: Megaphone, label: "Pengumuman", href: "/admin-dinas/pengumuman" },
                        { icon: Newspaper, label: "Berita", href: "/admin-dinas/berita" },
                        { icon: Ticket, label: "Tiket", href: "/admin-dinas/tickets" },
                    ],
                },
            ];
        case "admin_sekolah":
            return [
                {
                    items: [{ icon: LayoutDashboard, label: "Dashboard", href: "/admin-sekolah" }],
                },
                {
                    title: "Pendaftaran",
                    items: [
                        { icon: ClipboardList, label: "Daftar Pendaftar", href: "/admin-sekolah/pendaftar" },
                        { icon: FileText, label: "Verifikasi", href: "/admin-sekolah/verifikasi" },
                        { icon: BarChart3, label: "Pemeringkatan", href: "/admin-sekolah/ranking" },
                    ],
                },
                {
                    title: "Pengaturan",
                    items: [
                        { icon: Settings, label: "Profil Sekolah", href: "/admin-sekolah/profil" },
                        { icon: Users, label: "Kuota & Zonasi", href: "/admin-sekolah/kuota" },
                    ],
                },
                {
                    title: "Lainnya",
                    items: [
                        { icon: Megaphone, label: "Pengumuman", href: "/admin-sekolah/pengumuman" },
                        { icon: Ticket, label: "Tiket", href: "/admin-sekolah/tiket" },
                        { icon: FileSpreadsheet, label: "Laporan", href: "/admin-sekolah/laporan" },
                    ],
                },
            ];
        case "siswa":
        default:
            return [
                {
                    items: [{ icon: LayoutDashboard, label: "Dashboard", href: "/siswa" }],
                },
                {
                    title: "Pendaftaran",
                    items: [
                        { icon: FileText, label: "Formulir", href: "/siswa/formulir" },
                        { icon: ClipboardList, label: "Status Pendaftaran", href: "/siswa/status" },
                        { icon: Megaphone, label: "Pengumuman", href: "/siswa/pengumuman" },
                    ],
                },
                {
                    title: "Lainnya",
                    items: [
                        { icon: MessageSquare, label: "Tiket Bantuan", href: "/siswa/tiket" },
                        { icon: User, label: "Profil", href: "/siswa/profil" },
                    ],
                },
            ];
    }
};

// ============================================
// Sidebar Component
// ============================================

function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuthStore();
    const { isSidebarOpen, isMobile, toggleSidebar } = useUIStore();

    if (!user) return null;

    const menuGroups = getMenuByRole(user.role);

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobile && isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarOpen ? 280 : 0,
                    opacity: isSidebarOpen ? 1 : 0,
                }}
                className={cn(
                    "fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-50 overflow-hidden",
                    "lg:relative lg:z-0",
                    isMobile && !isSidebarOpen && "hidden"
                )}
            >
                <div className="w-[280px] h-full flex flex-col">
                    {/* Header */}
                    <div className="h-16 px-6 flex items-center justify-between border-b border-gray-100">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <span className="font-bold text-lg text-primary">SPMB</span>
                            </div>
                        </Link>
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-custom">
                        {menuGroups.map((group, groupIndex) => (
                            <div key={groupIndex} className="mb-4">
                                {group.title && (
                                    <p className="px-3 mb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        {group.title}
                                    </p>
                                )}
                                <div className="space-y-1">
                                    {group.items.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => isMobile && toggleSidebar()}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                                                    isActive
                                                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                                                        : "text-gray-600 hover:bg-gray-100"
                                                )}
                                            >
                                                <item.icon className="h-5 w-5" />
                                                {item.label}
                                                {item.badge && (
                                                    <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Footer - Help */}
                    <div className="p-3 border-t border-gray-100">
                        <Link
                            href="/help"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-all"
                        >
                            <HelpCircle className="h-5 w-5" />
                            Bantuan
                        </Link>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}

// ============================================
// Header Component
// ============================================

function Header() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { toggleSidebar } = useUIStore();
    const { unreadCount } = useNotificationStore();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    if (!user) return null;

    const roleLabels: Record<UserRole, string> = {
        super_admin: "Super Admin",
        admin_dinas: "Admin Dinas",
        admin_sekolah: "Admin Sekolah",
        siswa: "Siswa",
    };

    return (
        <header className="h-16 bg-white border-b border-gray-100 px-4 flex items-center justify-between sticky top-0 z-30">
            {/* Left Side */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Bell className="h-5 w-5 text-gray-600" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium text-sm">
                            {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-500">{roleLabels[user.role]}</p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                        {showUserMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                            >
                                <Link
                                    href={`/${user.role === "siswa" ? "siswa" : user.role.replace("_", "-")}/profil`}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                >
                                    <User className="h-4 w-4" />
                                    Profil
                                </Link>
                                <Link
                                    href={`/${user.role === "siswa" ? "siswa" : user.role.replace("_", "-")}/settings`}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                >
                                    <Settings className="h-4 w-4" />
                                    Pengaturan
                                </Link>
                                <hr className="my-2" />
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Keluar
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}

// ============================================
// Dashboard Layout Component
// ============================================

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const { setIsMobile } = useUIStore();

    // Check auth
    React.useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    // Handle resize
    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setIsMobile]);

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
