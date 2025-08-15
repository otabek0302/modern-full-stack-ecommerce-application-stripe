"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MapPin, Search, Heart, ShoppingBag, Globe, DollarSign, PhoneIcon, Mail, AlignJustify } from "lucide-react";
import { useStateContext } from "@/contexts/state-context";

const Header = () => {
    const { wishlistItems, cartItems, totalPrice } = useStateContext();

    const navigationItems = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/products" },
        { name: "About Us", href: "/about-us" },
        { name: "Contact Us", href: "/contact-us" },
        { name: "FAQ", href: "/faq" },
    ];

    return (
        <header className="w-full">
            {/* Top Bar - Store Location & Language/Currency */}
            <div className="bg-gray-100 py-2 px-4 hidden md:block">
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
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
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
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
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

                            <div className="flex gap-2">
                                <Link href="/auth/login" className="cursor-pointer hover:text-primary">
                                    <span className="cursor-pointer hover:text-primary">Sign In</span>
                                </Link>
                                <span className="text-gray-600 text-sm font-medium">/</span>
                                <Link href="/auth/register" className="cursor-pointer hover:text-primary">
                                    <span className="cursor-pointer hover:text-primary">Sign Up</span>
                                </Link>
                            </div>
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
                                <Image src="/Ecobazar.svg" alt="Ecobazar" fill className="object-cover" sizes="calc(100vw - 32px) calc(100vw - 32px) calc(100vw - 32px) calc(100vw - 32px)" />
                            </Link>
                            <span className="text-xl md:text-2xl font-bold text-gray-900">Ecobazar</span>
                        </div>

                        {/* Search Bar - Hidden on mobile */}
                        <div className="flex-1 max-w-2xl mx-4 hidden md:block relative">
                            <div className="relative flex items-center justify-end">
                                <Input placeholder="Search" className="w-full pl-4 pr-20 py-5 text-lg rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0" />
                                <Button size="sm" className="absolute w-28 h-full bg-primary hover:bg-primary/90 text-white px-14 py-5 rounded-r-xl rounded-l-none cursor-pointer">
                                    <Search className="w-5 h-5" />
                                    <span className="text-white">Search</span>
                                </Button>
                            </div>
                            {/* <div className="absolute top-2 left-0 translate-y-1/2 bg-gray-100 w-full h-full flex items-center justify-center border-2 border-gray-200 rounded-xl">
                            </div> */}
                        </div>

                        {/* Right Side - Wishlist, Cart, Mobile Menu */}
                        <div className="flex items-center gap-4 md:gap-6">
                            {/* Wishlist - Hidden on mobile */}
                            <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                                <div className="relative">
                                    <Heart className="w-6 h-6" />
                                    {wishlistItems.length > 0 && <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">{wishlistItems.length}</Badge>}
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="w-px h-4 bg-gray-600" />

                            {/* Shopping Cart */}
                            <div className="flex items-center gap-4 cursor-pointer hover:text-primary transition-colors">
                                <div className="relative">
                                    <ShoppingBag className="w-6 h-6" />
                                    {cartItems.length > 0 && <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">{cartItems.length}</Badge>}
                                </div>
                                <p className="hidden md:flex flex-col items-start">
                                    <span className="text-xs text-gray-600">Shopping cart:</span>
                                    <span className="text-sm font-semibold text-primary">${totalPrice.toFixed(2)}</span>
                                </p>
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
                                                <Image src="/Ecobazar.svg" alt="Ecobazar" fill className="object-cover" sizes="calc(100vw - 32px) calc(100vw - 32px) calc(100vw - 32px) calc(100vw - 32px)" />
                                            </Link>
                                            <span className="text-xl font-bold">Ecobazar</span>
                                        </div>

                                        {/* Mobile Search */}
                                        <div className="mb-6">
                                            <div className="relative flex items-center justify-end">
                                                <Input placeholder="Search" className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 focus:border-primary focus:ring-0" />
                                                <Button size="sm" className="absolute right-0 top-0 w-10 h-full bg-primary hover:bg-primary/90 text-white px-4 py-1 rounded-r-md rounded-l-none cursor-pointer">
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
                                        <div className="mt-4 space-y-4">
                                            <div className="flex items-center gap-2 text-primary">
                                                <div className="w-6 h-6 flex items-center justify-center bg-primary rounded-full">
                                                    <PhoneIcon className="w-3 h-3 text-white" />
                                                </div>
                                                <span className="text-gray-600 text-base font-medium">(123) 456-7890</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-primary">
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
                        <div className="flex items-center gap-2">
                            {/* Phone */}
                            <Link href="tel:+1234567890" className="flex items-center gap-2">
                                <div className="w-6 h-6 flex items-center justify-center bg-primary rounded-full">
                                    <PhoneIcon className="w-3 h-3 text-white" />
                                </div>
                                <span className="-mt-0.5 text-white text-base font-medium">(123) 456-7890</span>
                            </Link>
                            {/* Separator */}
                            <div className="w-px h-4 bg-gray-600" />

                            {/* Email */}
                            <Link href="/auth/login" className="flex items-center gap-2">
                                <div className="w-6 h-6 flex items-center justify-center bg-primary rounded-full">
                                    <Mail className="w-3 h-3 text-white" />
                                </div>
                                <span className="-mt-0.5 text-white text-base font-medium">info@ecobazar.com</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
