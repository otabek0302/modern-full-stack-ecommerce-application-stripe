import React from "react";

import { Button } from "./button";
import { Minus } from "lucide-react";
import { Plus } from "lucide-react";
import { useStateContext } from "@/contexts/state-context";

const QuantityCounter = ({ stockQuantity }: { stockQuantity: number }) => {
    const { incQty, decQty, qty } = useStateContext();

    return (
        <div className="flex items-center gap-4">
            <div className="py-1 px-2 flex items-center border border-gray-200 rounded-full">
                <Button variant="ghost" size="icon" onClick={() => decQty()} className="bg-gray-100 border border-gray-100 rounded-full cursor-pointer" disabled={qty <= 1}>
                    <Minus className="w-4 h-4 text-gray-600" />
                </Button>
                <span className="px-6 py-2 min-w-[3rem] text-center font-medium">{qty}</span>
                <Button variant="ghost" size="icon" onClick={() => incQty()} className="bg-gray-100 border border-gray-100 rounded-full cursor-pointer" disabled={qty >= stockQuantity}>
                    <Plus className="w-4 h-4 text-gray-600" />
                </Button>
            </div>
        </div>
    );
};

export default QuantityCounter;
