"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MapPin, Search, Heart, ShoppingBag, Globe, DollarSign, PhoneIcon, Mail, AlignJustify, LogOut, User2 } from "lucide-react";
import { useStateContext } from "@/contexts/state-context";
import { useUserContext } from "@/contexts/user-context";
import { urlFor } from "@/lib/sanity.client";
import { useRouter } from "next/navigation";

const Header = () => {
    const router = useRouter();
    const { wishlistItems, cartItems, totalPrice, isLoadingData } = useStateContext();
    const { user, isAuthenticated, logout } = useUserContext();

    const navigationItems = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/products" },
        { name: "About Us", href: "/about-us" },
        { name: "Contact Us", href: "/contact-us" },
        { name: "FAQ", href: "/faq" },
    ];

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="w-full">
            {/* Top Bar - Store Location & Language/Currency */}
            <div className="bg-gray-100 py-3 px-4 hidden md:block">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="flex items-center justify-between gap-4">
                        {/* Store Location */}
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-gray-600 text-sm font-medium">Store Location: Samarkand, Uzbekistan</span>
                        </div>

                        {/* Language/Currency */}
                        <div className="flex items-center gap-4 text-gray-600 text-sm">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                                        <Globe className="w-4 h-4 text-primary" />
                                        <span className="text-gray-600 text-sm font-medium">Eng</span>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="-translate-x-5">
                                    <DropdownMenuItem variant="default" className="text-gray-600">
                                        English
                                    </DropdownMenuItem>
                                    <DropdownMenuItem variant="default" className="text-gray-600">
                                        Spanish
                                    </DropdownMenuItem>
                                    <DropdownMenuItem variant="default" className="text-gray-600">
                                        French
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="w-px h-4 bg-gray-600" />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                                        <DollarSign className="w-4 h-4 text-primary" />
                                        <span className="text-gray-600 text-sm font-medium">USD</span>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="-translate-x-5">
                                    <DropdownMenuItem variant="default" className="text-gray-600">
                                        USD - US Dollar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem variant="default" className="text-gray-600">
                                        EUR - Euro
                                    </DropdownMenuItem>
                                    <DropdownMenuItem variant="default" className="text-gray-600">
                                        GBP - British Pound
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="w-px h-4 bg-gray-600" />

                            {/* Auth Section */}
                            {isAuthenticated ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
                                            <div className="relative w-8 h-8 border-2 border-primary rounded-full overflow-hidden flex items-center justify-center bg-primary/10">{user?.avatar ? <Image src={urlFor(user.avatar.asset._ref).width(240).height(240).fit("crop").url()} alt={user?.name} fill sizes="32px" className="object-cover" /> : <User2 className="w-5 h-5 text-primary" />}</div>
                                            <div className="flex flex-col items-start gap-0.5">
                                                <span className="text-gray-600 text-xs font-medium leading-none">{user?.name}</span>
                                                <span className="text-primary text-[10px] font-medium leading-none">{user?.email}</span>
                                            </div>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="-translate-x-5">
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile">Profile</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile/orders">Orders</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile/settings">Settings</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="flex gap-2">
                                    <Link href="/auth/sign-in" className="text-gray-600 hover:text-primary transition-colors font-medium">
                                        Sign In
                                    </Link>
                                    <span className="text-gray-600 text-sm font-medium">/</span>
                                    <Link href="/auth/sign-up" className="text-gray-600 hover:text-primary transition-colors font-medium">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header - Logo, Search, Cart */}
            <div className="bg-white py-4 md:py-6 px-4 shadow-sm">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Link href="/" className="relative w-8 h-8">
                                <Image src="/Ecobazar.svg" alt="Ecobazar" fill className="object-cover" sizes="32px" />
                            </Link>
                            <span className="text-xl md:text-2xl font-bold text-gray-900">Ecobazar</span>
                        </div>

                        {/* Search Bar - Hidden on mobile */}
                        <div className="flex-1 max-w-2xl mx-4 hidden md:block relative">
                            <div className="relative flex items-center justify-end">
                                <Input placeholder="Search products..." className="w-full pl-4 pr-20 py-5 text-lg rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0" />
                                <Button size="sm" className="absolute w-28 h-full bg-primary hover:bg-primary/90 text-white px-14 py-5 rounded-r-xl rounded-l-none cursor-pointer transition-colors">
                                    <Search className="w-5 h-5" />
                                    <span className="text-white">Search</span>
                                </Button>
                            </div>
                        </div>

                        {/* Right Side - Wishlist, Cart, Mobile Menu */}
                        <div className="flex items-center gap-4 md:gap-6">
                            {/* Wishlist - Hidden on mobile */}
                            <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-primary transition-colors" onClick={() => router.push("/profile/wishlist")}>
                                <div className="relative">
                                    {isLoadingData ? (
                                        <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Heart className="w-6 h-6" />
                                    )}
                                    {!isLoadingData && wishlistItems.length > 0 && <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">{wishlistItems.length}</Badge>}
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="w-px h-4 bg-gray-600" />

                            {/* Shopping Cart */}
                            <div className="flex items-center gap-4 cursor-pointer hover:text-primary transition-colors" onClick={() => router.push("/profile/cart")}>
                                <div className="relative">
                                    {isLoadingData ? (
                                        <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <ShoppingBag className="w-6 h-6" />
                                    )}
                                    {!isLoadingData && cartItems.length > 0 && <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">{cartItems.length}</Badge>}
                                </div>
                                <div className="hidden md:flex flex-col items-start">
                                    <span className="text-xs text-gray-600">Shopping cart:</span>
                                    <span className="text-sm font-semibold text-primary">${isLoadingData ? '...' : totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="block md:hidden w-px h-4 bg-gray-600" />

                            {/* Mobile Menu Button */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="clear" className="md:hidden h-7 w-7">
                                        <AlignJustify className="w-[26px!important] h-[26px!important]" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-80">
                                    <div className="px-4 py-6">
                                        <div className="flex items-center gap-2 mb-6">
                                            <Link href="/" className="relative w-8 h-8">
                                                <Image src="/Ecobazar.svg" alt="Ecobazar" fill className="object-cover" sizes="32px" />
                                            </Link>
                                            <span className="text-xl font-bold">Ecobazar</span>
                                        </div>

                                        {/* Mobile Auth Status */}
                                        {isAuthenticated ? (
                                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600">Welcome back,</p>
                                                <p className="font-medium text-gray-900">{user?.name}</p>
                                                <div className="mt-3 space-y-2">
                                                    <Link href="/profile" className="block text-sm text-primary hover:text-primary/80 transition-colors">
                                                        Profile
                                                    </Link>
                                                    <Link href="/profile/orders" className="block text-sm text-primary hover:text-primary/80 transition-colors">
                                                        Orders
                                                    </Link>
                                                    <button onClick={handleLogout} className="block text-sm text-red-600 hover:text-red-700 transition-colors">
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mb-6">
                                                <Link href="/auth/sign-in" className="block w-full text-center py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                                                    Sign In / Sign Up
                                                </Link>
                                            </div>
                                        )}

                                        {/* Mobile Search */}
                                        <div className="mb-6">
                                            <div className="relative flex items-center justify-end">
                                                <Input placeholder="Search products..." className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 focus:border-primary focus:ring-0" />
                                                <Button size="sm" className="absolute right-0 top-0 w-10 h-full bg-primary hover:bg-primary/90 text-white px-4 py-1 rounded-r-md rounded-l-none cursor-pointer transition-colors">
                                                    <Search className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Mobile Navigation */}
                                        <nav className="space-y-4">
                                            {navigationItems.map((item) => (
                                                <div key={item.name} className="border-b border-gray-200 pb-3">
                                                    <Link href={item.href} className="flex items-center justify-between text-gray-600 hover:text-primary transition-colors">
                                                        <span className="font-medium">{item.name}</span>
                                                    </Link>
                                                </div>
                                            ))}
                                        </nav>

                                        {/* Mobile Contact */}
                                        <div className="mt-6 space-y-4">
                                            <div className="flex items-center gap-3 text-primary">
                                                <div className="w-6 h-6 flex items-center justify-center bg-primary rounded-full">
                                                    <PhoneIcon className="w-3 h-3 text-white" />
                                                </div>
                                                <span className="text-gray-600 text-base font-medium">(123) 456-7890</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-primary">
                                                <div className="w-6 h-6 flex items-center justify-center bg-primary rounded-full">
                                                    <Mail className="w-3 h-3 text-white" />
                                                </div>
                                                <span className="text-gray-600 text-base font-medium">info@ecobazar.com</span>
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Bar - Hidden on mobile */}
            <nav className="bg-gray-900 py-4 px-4 hidden md:block">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            {navigationItems.map((item) => (
                                <Link key={item.name} href={item.href} className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors group">
                                    <span className="text-white text-base font-medium">{item.name}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Phone Number */}
                        <div className="flex items-center gap-4">
                            {/* Phone */}
                            <Link href="tel:+1234567890" className="flex items-center gap-2 hover:text-primary transition-colors">
                                <div className="w-6 h-6 flex items-center justify-center bg-primary rounded-full">
                                    <PhoneIcon className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-white text-base font-medium">(123) 456-7890</span>
                            </Link>
                            {/* Separator */}
                            <div className="w-px h-4 bg-gray-600" />

                            {/* Email */}
                            <Link href="mailto:info@ecobazar.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                                <div className="w-6 h-6 flex items-center justify-center bg-primary rounded-full">
                                    <Mail className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-white text-base font-medium">info@ecobazar.com</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
