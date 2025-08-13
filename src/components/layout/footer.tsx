"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Leaf, Facebook, Twitter, Instagram, Mail, Phone, Send } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "My Account",
            links: ["My Account", "Order History", "Shopping Cart", "Wishlist"],
        },
        {
            title: "Helps",
            links: ["Contact", "FAQs", "Terms & Condition", "Privacy Policy"],
        },
        {
            title: "Proxy",
            links: ["About", "Shop", "Product", "Track Order"],
        },
        {
            title: "Categories",
            links: ["Fruit & Vegetables", "Meat & Fish", "Bread & Bakery", "Beauty & Health"],
        },
    ];

    const paymentMethods = [
        { name: "Apple Pay", bg: "bg-black" },
        { name: "VISA", bg: "bg-blue-600" },
        { name: "DISCOVER", bg: "bg-orange-500" },
        { name: "Mastercard", bg: "bg-red-600" },
        { name: "Secure Payment", bg: "bg-gray-700" },
    ];

    return (
        <footer className="w-full bg-gray-50">
            {/* Newsletter Section */}
            <Card className="bg-gray-100 border-0 rounded-none">
                <CardContent className="py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                            {/* Left Side - Newsletter Info */}
                            <div className="flex-1 max-w-md text-center lg:text-left">
                                <CardTitle className="text-3xl font-bold text-gray-900 mb-4">Subscribe our Newsletter</CardTitle>
                                <p className="text-gray-600 leading-relaxed">Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna.</p>
                            </div>

                            {/* Right Side - Email Input & Social Icons */}
                            <div className="flex flex-col items-center gap-6">
                                {/* Email Subscription */}
                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    <Input placeholder="Your email address" className="w-full sm:w-80 px-4 py-3 border-2 border-gray-200 focus:border-[#1B5FFE] focus:ring-0" />
                                    <Button className="bg-[#1B5FFE] hover:bg-[#1B5FFE]/90 text-white px-8 py-3 rounded-lg">
                                        <Send className="w-4 h-4 mr-2" />
                                        Subscribe
                                    </Button>
                                </div>

                                {/* Social Media Icons */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-[#1B5FFE] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#1B5FFE]/90 transition-colors">
                                        <Facebook className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                                        <Twitter className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                                        <div className="w-5 h-5 text-white font-bold text-sm">P</div>
                                    </div>
                                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                                        <Instagram className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Footer Content */}
            <div className="bg-gray-900 py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                        {/* Brand Column */}
                        <div className="lg:col-span-1">
                            <Card className="bg-transparent border-0 shadow-none">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-[#1B5FFE] rounded-full flex items-center justify-center">
                                            <Leaf className="w-3 h-3 text-white" />
                                        </div>
                                        <CardTitle className="text-xl font-bold text-white">Ecobazar</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <p className="text-gray-400 mb-6 leading-relaxed">Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna congue nec.</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-[#1B5FFE] underline cursor-pointer hover:text-[#1B5FFE]/80">
                                            <Phone className="w-4 h-4" />
                                            <span>(219) 555-0114</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#1B5FFE] underline cursor-pointer hover:text-[#1B5FFE]/80">
                                            <Mail className="w-4 h-4" />
                                            <span>Proxy@gmail.com</span>
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
                                        <CardTitle className="text-white font-bold text-lg">{section.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <ul className="space-y-3">
                                            {section.links.map((link) => (
                                                <li key={link}>
                                                    <a href="#" className="text-gray-400 hover:text-[#1B5FFE] transition-colors cursor-pointer block">
                                                        {link}
                                                    </a>
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
            <div className="bg-gray-900 border-t border-gray-800 py-6 px-4">
                <div className="max-w-7xl mx-auto">
                    <Separator className="bg-gray-800 mb-6" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Copyright */}
                        <div className="text-gray-400 text-sm text-center md:text-left">© Ecobazar eCommerce {currentYear}. All Rights Reserved</div>

                        {/* Payment Methods */}
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {paymentMethods.map((payment) => (
                                <div key={payment.name} className={`${payment.bg} text-white text-xs px-3 py-2 rounded flex items-center justify-center min-w-[80px]`}>
                                    {payment.name === "Secure Payment" ? (
                                        <div className="flex items-center gap-1">
                                            <div className="w-3 h-3 border border-white rounded-sm"></div>
                                            <span>Secure</span>
                                        </div>
                                    ) : (
                                        payment.name
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
