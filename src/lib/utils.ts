import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function formatStatus(status: string | undefined | null) {
    const safeStatus = status?.toLowerCase?.() || "pending";
    switch (safeStatus) {
        case "pending":
            return "bg-yellow-500 text-white hover:bg-yellow-600";
        case "processing":
            return "bg-blue-500 text-white hover:bg-blue-600";
        case "completed":
            return "bg-green-500 text-white hover:bg-green-600";
        case "cancelled":
        case "failed":
            return "bg-red-500 text-white hover:bg-red-600";
        default:
            return "bg-gray-500 text-white hover:bg-gray-600";
    }
}
