"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    page: number;
    perPage: number;
    total: number;
    onChange: (next: number) => void;
    siblingCount?: number;
    rounded?: boolean;
};

export function Pagination({ page, perPage, total, onChange, siblingCount = 1, rounded = false }: Props) {
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const prevDisabled = page <= 1;
    const nextDisabled = page >= totalPages;

    const range: (number | "...")[] = [];
    const start = Math.max(1, page - siblingCount);
    const end = Math.min(totalPages, page + siblingCount);

    if (start > 1) {
        range.push(1);
        if (start > 2) range.push("...");
    }
    for (let p = start; p <= end; p++) range.push(p);
    if (end < totalPages) {
        if (end < totalPages - 1) range.push("...");
        range.push(totalPages);
    }

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onChange(page - 1)} disabled={prevDisabled} className="flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Previous</span>
            </Button>

            <div className="flex items-center gap-1">
                {range.map((item, i) =>
                    item === "..." ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
                            …
                        </span>
                    ) : (
                        <Button key={item} variant={page === item ? "default" : "outline"} size="sm" onClick={() => onChange(item)} className={page === item ? (rounded ? "h-10 w-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white" : "") : "h-10 w-10"}>
                            {item}
                        </Button>   
                    )
                )}
            </div>

            <Button variant="outline" size="sm" onClick={() => onChange(page + 1)} disabled={nextDisabled} className="flex items-center gap-1">
                <span className="sr-only sm:not-sr-only">Next</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}