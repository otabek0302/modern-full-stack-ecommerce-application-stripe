import React from "react";
import { Facebook, Twitter, Instagram, Send } from "lucide-react";

const ProductSharing = () => {
    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Share item:</span>
            <div className="flex gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                    <Facebook className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                    <Twitter className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                    <Send className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                    <Instagram className="w-4 h-4 text-white" />
                </div>
            </div>  
        </div>
    );
};

export default ProductSharing;
