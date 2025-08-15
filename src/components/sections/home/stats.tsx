import React from "react";
import { Truck, Headphones, Shield, Package } from "lucide-react";

const Stats = () => {
    return (
        <section className="relative">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-4 cursor-pointer hover:text-primary transition-colors">
                        <div className="relative">
                            <Truck className="w-10 h-10 text-primary" />
                        </div>
                        <p className="hidden md:flex flex-col items-start">
                            <span className="text-gray-900 text-xl font-medium">Free Shipping</span>
                            <span className="text-gray-600 text-sm font-normal">Free shipping on all your order</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4 cursor-pointer hover:text-primary transition-colors">
                        <div className="relative">
                            <Headphones className="w-10 h-10 text-primary" />
                        </div>
                        <p className="hidden md:flex flex-col items-start">
                            <span className="text-gray-900 text-xl font-medium">Customer Support 24/7</span>
                            <span className="text-gray-600 text-sm font-normal">Instant access to Support</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4 cursor-pointer hover:text-primary transition-colors">
                        <div className="relative">
                            <Shield className="w-10 h-10 text-primary" />
                        </div>
                        <p className="hidden md:flex flex-col items-start">
                            <span className="text-gray-900 text-xl font-medium">100% Secure Payment</span>
                            <span className="text-gray-600 text-sm font-normal">We ensure your money is safe</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4 cursor-pointer hover:text-primary transition-colors">
                        <div className="relative">
                            <Package className="w-10 h-10 text-primary" />
                        </div>
                        <p className="hidden md:flex flex-col items-start">
                            <span className="text-gray-900 text-xl font-medium">Money-Back Guarantee</span>
                            <span className="text-gray-600 text-sm font-normal">30 Days Money-Back Guarantee</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;
