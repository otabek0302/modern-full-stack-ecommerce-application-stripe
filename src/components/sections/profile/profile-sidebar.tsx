"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, RefreshCw, Heart, ShoppingBag, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/contexts/user-context";

const ProfileSidebar = () => {
    const pathname = usePathname();
    const { logout } = useUserContext();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="w-full h-full border border-gray-200 rounded-lg p-4">
            <div className="mb-4">
                <h3 className="text-gray-900 text-2xl font-semibold">Navigation</h3>
            </div>
            <div className="space-y-2">
                <Button variant="clear" size="clear" asChild>
                    <Link href="/profile" className={`w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${pathname === "/profile" ? "bg-primary/10 text-primary border-l-4 border-primary" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
                        <LayoutDashboard className={`w-5 h-5 ${pathname === "/profile" ? "text-primary" : "text-gray-600"}`} />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                </Button>
                <Button variant="clear" size="clear" asChild>
                    <Link href="/profile/orders" className={`w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${pathname === "/profile/orders" ? "bg-primary/10 text-primary border-l-4 border-primary" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
                        <RefreshCw className={`w-5 h-5 ${pathname === "/profile/orders" ? "text-primary" : "text-gray-600"}`} />
                        <span className="font-medium">Order History</span>
                    </Link>
                </Button>
                <Button variant="clear" size="clear" asChild>
                    <Link href="/profile/wishlist" className={`w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${pathname === "/profile/wishlist" ? "bg-primary/10 text-primary border-l-4 border-primary" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
                        <Heart className={`w-5 h-5 ${pathname === "/profile/wishlist" ? "text-primary" : "text-gray-600"}`} />
                        <span className="font-medium">Wishlist</span>
                    </Link>
                </Button>
                <Button variant="clear" size="clear" asChild>
                    <Link href="/profile/cart" className={`w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${pathname === "/profile/cart" ? "bg-primary/10 text-primary border-l-4 border-primary" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
                        <ShoppingBag className={`w-5 h-5 ${pathname === "/profile/cart" ? "text-primary" : "text-gray-600"}`} />
                        <span className="font-medium">Shopping Cart</span>
                    </Link>
                </Button>
                <Button variant="clear" size="clear" asChild>
                    <Link href="/profile/settings" className={`w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${pathname === "/profile/settings" ? "bg-primary/10 text-primary border-l-4 border-primary" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
                        <Settings className={`w-5 h-5 ${pathname === "/profile/settings" ? "text-primary" : "text-gray-600"}`} />
                        <span className="font-medium">Settings</span>
                    </Link>
                </Button>
                <Button 
                    variant="clear" 
                    size="clear" 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                    <LogOut className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Log-out</span>
                </Button>
            </div>
        </div>
    );
};

export default ProfileSidebar;
