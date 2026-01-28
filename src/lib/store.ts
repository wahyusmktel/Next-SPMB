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
import { api } from "./api";


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
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,

    login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
            const response = await api.post<{
                access_token: string;
                token_type: string;
                user: User;
            }>("/auth/login", new URLSearchParams({
                username: email,
                password: password,
            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            if (response.access_token) {
                // In a real app, we might use cookies or localStorage
                localStorage.setItem("spmb_token", response.access_token);
                set({
                    user: response.user,
                    isAuthenticated: true,
                    isLoading: false
                });
                return true;
            }
        } catch (error) {
            console.error("Login failed:", error);
        }

        set({ isLoading: false });
        return false;
    },

    logout: () => {
        localStorage.removeItem("spmb_token");
        set({ user: null, isAuthenticated: false });
    },

    setUser: (user: User) => {
        set({ user, isAuthenticated: true });
    },

    checkAuth: async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("spmb_token") : null;
        if (!token) {
            set({ isAuthenticated: false, user: null });
            return;
        }

        try {
            const user = await api.get<User>("/auth/me");
            set({ user, isAuthenticated: true });
        } catch (error) {
            console.error("Auth check failed:", error);
            localStorage.removeItem("spmb_token");
            set({ isAuthenticated: false, user: null });
        }
    },
}));

// ============================================
// Data Store
// ============================================

interface DataState extends DummyDataStore {
    isInitialized: boolean;
    isLoading: boolean;
    initialize: () => Promise<void>;

    // Mutations
    addUser: (user: User) => void;
    addSiswa: (siswa: Siswa) => void;

    // Getters
    getSekolahByDinas: (dinas_id: string) => Sekolah[];
    getSekolahById: (id: string) => Sekolah | undefined;
    getDinasById: (id: string) => Dinas | undefined;
    getUserByEmail: (email: string) => User | undefined;
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

    initialize: async () => {
        if (get().isInitialized) return;

        set({ isLoading: true });
        try {
            // 1. Fetch Public Data (No Auth Required)
            const [schools, dinasList, jalurList, activeTahun, pengumumanList, beritaList] = await Promise.all([
                api.get<Sekolah[]>("/sekolah/"),
                api.get<Dinas[]>("/dinas/"),
                api.get<Jalur[]>("/config/jalur"),
                api.get<TahunAjaran>("/config/tahun-ajaran/active"),
                api.get<Pengumuman[]>("/common/pengumuman"),
                api.get<Berita[]>("/common/berita"),
            ]);

            set({
                sekolah: schools,
                dinas: dinasList,
                jalur: jalurList,
                tahunAjaran: activeTahun,
                pengumuman: pengumumanList,
                berita: beritaList,
            });

            // 2. Fetch User-Specific Data if Authenticated
            const token = typeof window !== "undefined" ? localStorage.getItem("spmb_token") : null;
            if (token) {
                try {
                    const pendaftaranList = await api.get<Pendaftaran[]>("/pendaftaran/");
                    set({ pendaftaran: pendaftaranList });
                } catch (err) {
                    console.warn("Failed to fetch protected data, session might have expired.");
                    localStorage.removeItem("spmb_token");
                }
            } else {
                // Fallback to empty if not logged in
                set({ pendaftaran: [] });
            }

            set({
                isInitialized: true,
                isLoading: false,
            });
        } catch (error) {
            console.error("Failed to initialize public data from API:", error);
            // Fallback to dummy data on error for better dev experience
            const data = generateCompleteDataStore();
            set({
                ...data,
                isInitialized: true,
                isLoading: false,
            });
        }
    },

    addUser: (user: User) => {
        set((state) => ({
            users: [...state.users, user],
        }));
    },

    addSiswa: (siswa: Siswa) => {
        set((state) => ({
            siswa: [...state.siswa, siswa],
        }));
    },

    getUserByEmail: (email: string) => {
        return get().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    },

    getSekolahByDinas: (dinas_id: string) => {
        return get().sekolah.filter((s) => s.dinas_id === dinas_id);
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

    getStatsDinas: (dinas_id: string) => {
        const sekolahList = get().sekolah.filter((s) => s.dinas_id === dinas_id);
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
