"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Mail, Phone, Send, Apple, DollarSign } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "My Account",
            links: [
                { name: "My Account", href: "/account/my-account" },
                { name: "Order History", href: "/account/order-history" },
                { name: "Shopping Cart", href: "/account/shopping-cart" },
                { name: "Wishlist", href: "/account/wishlist" },
            ],
        },
        {
            title: "Helps",
            links: [
                { name: "Contact", href: "/contact" },
                { name: "FAQs", href: "/faqs" },
                { name: "Terms & Condition", href: "/terms-and-condition" },
                { name: "Privacy Policy", href: "/privacy-policy" },
            ],
        },
        {
            title: "Proxy",
            links: [
                { name: "About", href: "/about" },
                { name: "Shop", href: "/shop" },
                { name: "Product", href: "/product" },
                { name: "Faq", href: "/faq" },
            ],
        },
        {
            title: "Categories",
            links: [
                { name: "Fruit & Vegetables", href: "/products?category=fruit-and-vegetables" },
                { name: "Meat & Fish", href: "/products?category=meat-and-fish" },
                { name: "Bread & Bakery", href: "/products?category=bread-and-bakery" },
                { name: "Beauty & Health", href: "/products?category=beauty-and-health" },
            ],
        },
    ];

    return (
        <footer className="w-full">
            {/* Newsletter Section */}
            <Card className="bg-gray-100 border-0 rounded-none shadow-none">
                <CardContent className="container mx-auto px-4 lg:px-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        {/* Left Side - Newsletter Info */}
                        <div className="flex-1 max-w-md text-center lg:text-left">
                            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Subscribe our Newsletter</CardTitle>
                            <p className="text-gray-600 text-sm font-normal leading-relaxed">Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna.</p>
                        </div>

                        {/* Right Side - Email Input & Social Icons */}
                        <div className="flex items-center gap-4">
                            {/* Email Subscription */}
                            <div className="relative">
                                <Input placeholder="Your email address" className="w-full sm:w-96 px-4 py-3 border-2 border-gray-200 focus:border-primary focus:ring-0" />
                                <Button className="absolute right-0 top-0 w-fit h-full bg-primary hover:bg-primary/90 text-white px-4 py-1 rounded-r-md rounded-l-none cursor-pointer">
                                    <Send className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Subscribe</span>
                                </Button>
                            </div>

                            {/* Social Media Icons */}
                            <div className="flex gap-4">
                                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                                    <Facebook className="w-5 h-5 text-white" />
                                </div>
                                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                                    <Twitter className="w-5 h-5 text-white" />
                                </div>
                                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                                    <Send className="w-5 h-5 text-white" />
                                </div>
                                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                                    <Instagram className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Footer Content */}
            <div className="bg-gray-900 py-12">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
                        {/* Brand Column */}
                        <div className="lg:col-span-2">
                            <Card className="bg-transparent border-0 shadow-none">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Link href="/" className="relative w-8 h-8">
                                            <Image src="/Ecobazar.svg" alt="Ecobazar" fill className="object-cover" sizes="calc(100vw - 32px) calc(100vw - 32px) calc(100vw - 32px) calc(100vw - 32px)" />
                                        </Link>
                                        <CardTitle className="text-xl md:text-2xl font-bold text-white">Ecobazar</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <p className="text-gray-300 text-base font-normal leading-relaxed mb-4">Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna congue nec.</p>
                                    <div className="space-y-4 mt-6">
                                        <div className="flex items-center gap-4 text-primary">
                                            <div className="w-6 h-6 flex items-center justify-center bg-primary rounded-full">
                                                <Phone className="w-3 h-3 text-white" />
                                            </div>
                                            <div className="relative -top-1">
                                                <Link href="tel:+1234567890" className="text-gray-300 text-sm font-normal hover:text-primary transition-colors">
                                                    (123) 456-7890
                                                </Link>
                                                <span className="absolute -bottom-1 left-0 h-[1px] w-full bg-primary"></span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-primary">
                                            <div className="w-6 h-6 flex items-center justify-center bg-primary rounded-full">
                                                <Mail className="w-3 h-3 text-white" />
                                            </div>
                                            <div className="relative -top-1">
                                                <Link href="mailto:info@ecobazar.com" className="text-gray-300 text-sm font-normal hover:text-primary transition-colors">
                                                    info@ecobazar.com
                                                </Link>
                                                <span className="absolute -bottom-1 left-0 h-[1px] w-full bg-primary"></span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Dynamic Footer Sections */}
                        {footerSections.map((section) => (
                            <div key={section.title}>
                                <Card className="bg-transparent border-0 shadow-none">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-gray-300 text-base font-bold leading-relaxed hover:text-primary transition-colors">{section.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <ul className="space-y-3">
                                            {section.links.map((link) => (
                                                <li key={link.name + link.href}>
                                                    <Link href={link.href} className="text-gray-300 text-sm font-normal hover:text-primary transition-colors cursor-pointer block">
                                                        {link.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Strip - Copyright & Payment Methods */}
            <div className="bg-gray-900 py-6">
                <div className="container mx-auto px-4 lg:px-6">
                    <Separator className="bg-gray-800 mb-6" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Copyright */}
                        <div className="text-gray-600 text-sm font-normal text-center md:text-left">© Ecobazar eCommerce {currentYear}. All Rights Reserved</div>

                        {/* Payment Methods */}
                        <ul className="flex flex-wrap items-center justify-center gap-3">
                            <Button type="button" variant="primary" size="sm" className="px-3 py-2 min-w-[100px] max-w-[200px]">
                                <Apple className="w-4 h-4 mr-2" />
                                <span className="text-white text-sm font-normal">Apple Pay</span>
                            </Button>
                            <Button type="button" variant="primary" size="sm" className="px-3 py-2 min-w-[100px] max-w-[200px]">
                                <DollarSign className="w-4 h-4 mr-2" />
                                <span className="text-white text-sm font-normal">VISA</span>
                            </Button>
                            <Button type="button" variant="primary" size="sm" className="px-3 py-2 min-w-[100px] max-w-[200px]">
                                <DollarSign className="w-4 h-4 mr-2" />
                                <span className="text-white text-sm font-normal">Mastercard</span>
                            </Button>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
