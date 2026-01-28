"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { ToastContainer } from "@/components/ui";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <>
            {children}
            <ToastContainer />
        </>
    );
}
