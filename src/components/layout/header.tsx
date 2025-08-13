"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MapPin, Search, Heart, ShoppingBag, Phone, ChevronDown, Globe, DollarSign, Menu } from "lucide-react";

const Header = () => {
    const [cartItems] = useState(2);
    const [cartTotal] = useState(57.0);

    const navigationItems = [
        { name: "Home", hasDropdown: true, href: "/" },
        { name: "Shop", hasDropdown: true, href: "/shop" },
        { name: "Pages", hasDropdown: true, href: "/pages" },
        { name: "Blog", hasDropdown: true, href: "/blog" },
        { name: "About Us", hasDropdown: false, href: "/about" },
        { name: "Contact Us", hasDropdown: false, href: "/contact" },
    ];

    return (
        <header className="w-full">
            {/* Top Bar - Store Location & Language/Currency */}
            <div className="bg-gray-100 py-2 px-4 hidden md:block">
                <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-[#1B5FFE]" />
                        <span>Store Location: Lincoln- 344, Illinois, Chicago, USA</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-1 cursor-pointer hover:text-[#1B5FFE]">
                                    <Globe className="w-4 h-4" />
                                    <span>Eng</span>
                                    <ChevronDown className="w-3 h-3" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>English</DropdownMenuItem>
                                <DropdownMenuItem>Spanish</DropdownMenuItem>
                                <DropdownMenuItem>French</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="w-px h-4 bg-gray-300"></div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-1 cursor-pointer hover:text-[#1B5FFE]">
                                    <DollarSign className="w-4 h-4" />
                                    <span>USD</span>
                                    <ChevronDown className="w-3 h-3" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>USD - US Dollar</DropdownMenuItem>
                                <DropdownMenuItem>EUR - Euro</DropdownMenuItem>
                                <DropdownMenuItem>GBP - British Pound</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="w-px h-4 bg-gray-300"></div>

                        <div className="flex gap-2">
                            <span className="cursor-pointer hover:text-[#1B5FFE]">Sign In</span>
                            <span>/</span>
                            <span className="cursor-pointer hover:text-[#1B5FFE]">Sign Up</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header - Logo, Search, Cart */}
            <div className="bg-white py-4 md:py-6 px-4 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 bg-[#1B5FFE] rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                        <span className="text-xl md:text-2xl font-bold text-gray-900">Ecobazar</span>
                    </div>

                    {/* Search Bar - Hidden on mobile */}
                    <div className="flex-1 max-w-2xl mx-4 hidden md:block">
                        <div className="relative">
                            <Input placeholder="Search" className="w-full pl-4 pr-20 py-3 text-lg border-2 border-gray-200 focus:border-[#1B5FFE] focus:ring-0" />
                            <Button className="absolute right-1 top-1 bg-[#1B5FFE] hover:bg-[#1B5FFE]/90 text-white px-6 py-2 rounded-lg">
                                <Search className="w-5 h-5 mr-2" />
                                Search
                            </Button>
                        </div>
                    </div>

                    {/* Right Side - Wishlist, Cart, Mobile Menu */}
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Wishlist - Hidden on mobile */}
                        <div className="hidden md:flex flex-col items-center gap-1 cursor-pointer hover:text-[#1B5FFE] transition-colors">
                            <Heart className="w-6 h-6" />
                            <span className="text-xs text-gray-600">Wishlist</span>
                        </div>

                        {/* Shopping Cart */}
                        <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-[#1B5FFE] transition-colors">
                            <div className="relative">
                                <ShoppingBag className="w-6 h-6" />
                                {cartItems > 0 && <Badge className="absolute -top-2 -right-2 bg-[#1B5FFE] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">{cartItems}</Badge>}
                            </div>
                            <span className="text-xs text-gray-600 hidden md:block">Shopping cart:</span>
                            <span className="text-sm font-semibold text-[#1B5FFE]">${cartTotal.toFixed(2)}</span>
                        </div>

                        {/* Mobile Menu Button */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="sm" className="md:hidden p-2">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80">
                                <div className="py-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-8 h-8 bg-[#1B5FFE] rounded-full flex items-center justify-center">
                                            <div className="w-4 h-4 bg-white rounded-full"></div>
                                        </div>
                                        <span className="text-xl font-bold">Ecobazar</span>
                                    </div>

                                    {/* Mobile Search */}
                                    <div className="mb-6">
                                        <div className="relative">
                                            <Input placeholder="Search" className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 focus:border-[#1B5FFE] focus:ring-0" />
                                            <Button size="sm" className="absolute right-1 top-1 bg-[#1B5FFE] hover:bg-[#1B5FFE]/90 text-white px-3 py-1 rounded">
                                                <Search className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Mobile Navigation */}
                                    <nav className="space-y-4">
                                        {navigationItems.map((item) => (
                                            <div key={item.name} className="border-b border-gray-200 pb-3">
                                                <a href={item.href} className="flex items-center justify-between text-gray-700 hover:text-[#1B5FFE] transition-colors">
                                                    <span className="font-medium">{item.name}</span>
                                                    {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                                                </a>
                                            </div>
                                        ))}
                                    </nav>

                                    {/* Mobile Contact */}
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <div className="flex items-center gap-2 text-[#1B5FFE]">
                                            <Phone className="w-4 h-4" />
                                            <span className="font-medium">(219) 555-0114</span>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            {/* Navigation Bar - Hidden on mobile */}
            <nav className="bg-gray-800 py-4 px-4 hidden md:block">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        {navigationItems.map((item) => (
                            <div key={item.name} className="flex items-center gap-1 cursor-pointer hover:text-[#1B5FFE] transition-colors group">
                                <span className="text-white font-medium">{item.name}</span>
                                {item.hasDropdown && <ChevronDown className="w-4 h-4 text-white group-hover:text-[#1B5FFE] transition-colors" />}
                            </div>
                        ))}
                    </div>

                    {/* Phone Number */}
                    <div className="flex items-center gap-2 text-white">
                        <Phone className="w-4 h-4 text-[#1B5FFE]" />
                        <span className="font-medium">(219) 555-0114</span>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
