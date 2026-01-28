import { create } from "zustand";
import { generateCompleteDataStore, type DummyDataStore } from "@/data/dummy/generators";
import type {
    User,
    Dinas,
    Sekolah,
    Jalur,
    TahunAjaran,
    Siswa,
    OrangTua,
    Pendaftaran,
    Pengumuman,
    Berita,
    Kuota,
    Notifikasi,
    Tiket,
} from "@/data/types";

// ============================================
// Auth Store
// ============================================

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,

    login: async (email: string, password: string) => {
        set({ isLoading: true });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Initialize data store if not already initialized
        const dataStore = useDataStore.getState();
        if (!dataStore.isInitialized) {
            dataStore.initialize();
        }

        // Demo accounts for login (hardcoded for reliability)
        const now = new Date();
        const demoAccounts: User[] = [
            {
                id: "super-admin-001",
                email: "super.admin@edu.id",
                name: "Super Admin",
                role: "super_admin",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "admin-dinas-001",
                email: "admin.bandung@edu.id",
                name: "Admin Dinas Bandung",
                role: "admin_dinas",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "admin-sekolah-001",
                email: "admin.sdn1.sukajadi@edu.id",
                name: "Admin SDN 1 Sukajadi",
                role: "admin_sekolah",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "siswa-001",
                email: "ahmad.pratama@gmail.com",
                name: "Ahmad Pratama",
                role: "siswa",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
        ];

        // Check demo accounts first, then data store users
        let user = demoAccounts.find((u) => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            const updatedStore = useDataStore.getState();
            user = updatedStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        }

        if (user && password === "password123") {
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
        }

        set({ isLoading: false });
        return false;
    },

    logout: () => {
        set({ user: null, isAuthenticated: false });
    },

    setUser: (user: User) => {
        set({ user, isAuthenticated: true });
    },
}));

// ============================================
// Data Store
// ============================================

interface DataState extends DummyDataStore {
    isInitialized: boolean;
    isLoading: boolean;
    initialize: () => void;

    // Getters
    getSekolahByDinas: (dinasId: string) => Sekolah[];
    getSekolahById: (id: string) => Sekolah | undefined;
    getDinasById: (id: string) => Dinas | undefined;
    getSiswaById: (id: string) => Siswa | undefined;
    getPendaftaranBySiswa: (siswaId: string) => Pendaftaran[];
    getPendaftaranBySekolah: (sekolahId: string) => Pendaftaran[];
    getKuotaBySekolah: (sekolahId: string) => Kuota[];
    getOrangTuaBySiswa: (siswaId: string) => OrangTua[];

    // Stats
    getStatsDinas: (dinasId: string) => {
        totalSekolah: number;
        totalPendaftar: number;
        diterima: number;
        menunggu: number;
    };
    getStatsSekolah: (sekolahId: string) => {
        totalPendaftar: number;
        diterima: number;
        menunggu: number;
        kuotaTerisi: number;
        kuotaTotal: number;
    };
}

export const useDataStore = create<DataState>((set, get) => ({
    isInitialized: false,
    isLoading: false,
    users: [],
    dinas: [],
    sekolah: [],
    jalur: [],
    tahunAjaran: {} as TahunAjaran,
    siswa: [],
    orangTua: [],
    pendaftaran: [],
    kuota: [],
    pengumuman: [],
    berita: [],

    initialize: () => {
        if (get().isInitialized) return;

        set({ isLoading: true });
        const data = generateCompleteDataStore();
        set({
            ...data,
            isInitialized: true,
            isLoading: false,
        });
    },

    getSekolahByDinas: (dinasId: string) => {
        return get().sekolah.filter((s) => s.dinasId === dinasId);
    },

    getSekolahById: (id: string) => {
        return get().sekolah.find((s) => s.id === id);
    },

    getDinasById: (id: string) => {
        return get().dinas.find((d) => d.id === id);
    },

    getSiswaById: (id: string) => {
        return get().siswa.find((s) => s.id === id);
    },

    getPendaftaranBySiswa: (siswaId: string) => {
        return get().pendaftaran.filter((p) => p.siswaId === siswaId);
    },

    getPendaftaranBySekolah: (sekolahId: string) => {
        return get().pendaftaran.filter((p) => p.sekolahId === sekolahId);
    },

    getKuotaBySekolah: (sekolahId: string) => {
        return get().kuota.filter((k) => k.sekolahId === sekolahId);
    },

    getOrangTuaBySiswa: (siswaId: string) => {
        return get().orangTua.filter((o) => o.siswaId === siswaId);
    },

    getStatsDinas: (dinasId: string) => {
        const sekolahList = get().sekolah.filter((s) => s.dinasId === dinasId);
        const sekolahIds = sekolahList.map((s) => s.id);
        const pendaftaranList = get().pendaftaran.filter((p) => sekolahIds.includes(p.sekolahId));

        return {
            totalSekolah: sekolahList.length,
            totalPendaftar: pendaftaranList.length,
            diterima: pendaftaranList.filter((p) => p.status === "diterima").length,
            menunggu: pendaftaranList.filter((p) => ["submitted", "verifikasi"].includes(p.status)).length,
        };
    },

    getStatsSekolah: (sekolahId: string) => {
        const pendaftaranList = get().pendaftaran.filter((p) => p.sekolahId === sekolahId);
        const kuotaList = get().kuota.filter((k) => k.sekolahId === sekolahId);

        return {
            totalPendaftar: pendaftaranList.length,
            diterima: pendaftaranList.filter((p) => p.status === "diterima").length,
            menunggu: pendaftaranList.filter((p) => ["submitted", "verifikasi"].includes(p.status)).length,
            kuotaTerisi: kuotaList.reduce((acc, k) => acc + k.terisi, 0),
            kuotaTotal: kuotaList.reduce((acc, k) => acc + k.kuota, 0),
        };
    },
}));

// ============================================
// UI Store
// ============================================

interface UIState {
    isSidebarOpen: boolean;
    isMobile: boolean;
    theme: "light" | "dark";
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setIsMobile: (isMobile: boolean) => void;
    setTheme: (theme: "light" | "dark") => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSidebarOpen: true,
    isMobile: false,
    theme: "light",

    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),
    setIsMobile: (isMobile: boolean) => set({ isMobile, isSidebarOpen: !isMobile }),
    setTheme: (theme: "light" | "dark") => set({ theme }),
}));

// ============================================
// Notification Store
// ============================================

interface NotificationState {
    notifications: Notifikasi[];
    unreadCount: number;
    addNotification: (notification: Omit<Notifikasi, "id" | "createdAt" | "isRead">) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,

    addNotification: (notification) => {
        const newNotification: Notifikasi = {
            ...notification,
            id: crypto.randomUUID(),
            isRead: false,
            createdAt: new Date(),
        };
        set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        }));
    },

    markAsRead: (id: string) => {
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, isRead: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
        }));
    },

    markAllAsRead: () => {
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
            unreadCount: 0,
        }));
    },

    clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
    },
}));
