export const STORAGE_KEYS = {
    user: "ecobazaar:user",
} as const

export function getStoredUser<T = any>(): T | null {
    if (typeof window === "undefined") return null
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.user)
        return raw ? (JSON.parse(raw) as T) : null
    } catch {
        return null
    }
}

export function setStoredUser<T = any>(user: T) {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
}

export function clearStoredUser() {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEYS.user)
}