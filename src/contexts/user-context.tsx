"use client";

import { useEffect } from "react";
import { createContext, useContext } from "react";
import { UserType } from "@/interfaces";
import { useState } from "react";
import { toast } from "sonner";

type UserContextValue = {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
    isAuthenticated: boolean;
};

const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    // Check for authenticated user on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('/api/auth/me');
            const data = await response.json();
            if (data.user) {
                setUser(data.user);
            }
        } catch (error) {
            console.error('Auth check error:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setLoading(true);

            if (!email || !password) {
                toast.error("Please enter your email and password");
                return false;
            }

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Login failed. Please try again.");
                return false;
            }

            setUser(data.user);
            toast.success("Successfully logged in!");
            return true;
        } catch (error) {
            console.error(error);
            toast.error("Login failed. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        try {
            setLoading(true);

            if (!name || !email || !password) {
                toast.error("Please enter your name, email and password");
                return false;
            }

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Registration failed. Please try again.");
                return false;
            }

            setUser(data.user);
            toast.success("Successfully registered!");
            return true;
        } catch (error) {
            console.error(error);
            toast.error("Registration failed. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
            });
            
            setUser(null);
            toast.success("Successfully logged out!");
        } catch (error) {
            console.error('Logout error:', error);
            // Even if the API call fails, clear local state
            setUser(null);
            toast.success("Successfully logged out!");
        }
    };

    const isAuthenticated = !!user;

    return <UserContext.Provider value={{ user, setUser, login, register, logout, loading, isAuthenticated }}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUserContext must be used within a UserProvider");
    return context;
};
