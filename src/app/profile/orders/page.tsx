"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Eye, Package, Calendar, DollarSign } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserContext } from "@/contexts/user-context";
import { Pagination } from "@/components/ui/pagination";
import { OrderType } from "@/interfaces/index";

// ---- helpers ---------------------------------------------------------------
const fmtDate = (d: string | Date) => new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));

const fmtMoney = (n: number, currency = "USD") => new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);

const statusPill = (status: string) => {
    const s = status?.toLowerCase?.() || "";
    if (s === "completed") return "text-primary bg-primary/10";
    if (s === "processing") return "text-blue-600 bg-blue-100";
    if (s.includes("way")) return "text-orange-600 bg-orange-100";
    return "text-gray-600 bg-gray-100";
};

// ---- component ------------------------------------------------------------
export default function OrdersPage() {
    const { user } = useUserContext();
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch orders directly from order model
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?._id) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/user/orders?userId=${user._id}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data.orders || []);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user?._id]);

    // Shape the data coming from API into what the table needs.
    const shaped = useMemo(
        () =>
            (orders || []).map((order) => ({
                id: order._id, // used for display & URL
                date: order.createdAt,
                total: order.totalPrice,
                itemsCount: order.products.length,
                status: order.status ?? "processing",
                currency: order.paymentMethod?.name ?? "USD",
            })),
        [orders]
    );

    // pagination
    const [page, setPage] = useState(1);
    const perPage = 12;

    const total = shaped.length;
    const start = (page - 1) * perPage;
    const current = shaped.slice(start, start + perPage);

    if (loading) {
        return (
            <div className="space-y-8">
                <Card className="border border-gray-200 rounded-lg shadow-none">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Package className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-xl font-semibold text-gray-900">Order History</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-center py-12">
                            <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-2 text-gray-600">Loading orders...</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <Card className="border border-gray-200 rounded-lg shadow-none">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Package className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-900">Order History</CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-4 py-4 text-left font-semibold text-gray-700">ORDER ID</th>
                                    <th className="px-4 py-4 text-left font-semibold text-gray-700">DATE</th>
                                    <th className="px-4 py-4 text-left font-semibold text-gray-700">TOTAL</th>
                                    <th className="px-4 py-4 text-left font-semibold text-gray-700">STATUS</th>
                                    <th className="px-4 py-4 text-left font-semibold text-gray-700">ACTION</th>
                                </tr>
                            </thead>

                            <tbody>
                                {current.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-12 text-center text-gray-500" colSpan={5}>
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <Package className="h-8 w-8 text-gray-400" />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-gray-500 text-lg font-medium">No orders yet</p>
                                                    <p className="text-gray-400 text-sm">Start shopping to see your order history here.</p>
                                                </div>
                                                <Link href="/products" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                                                    Start Shopping
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    current.map((o) => (
                                        <tr key={String(o.id)} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4 font-medium text-gray-900">#{String(o.id).slice(-8)}</td>
                                            <td className="px-4 py-4 text-gray-600 flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                {fmtDate(o.date)}
                                            </td>
                                            <td className="px-4 py-4 text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                                    <span className="font-semibold text-gray-900">{fmtMoney(o.total, o.currency)}</span>
                                                </div>
                                                <span className="text-gray-400 text-sm">
                                                    ({o.itemsCount} {o.itemsCount === 1 ? "Product" : "Products"})
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusPill(o.status)}`}>{o.status}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <Link href={`/profile/orders/${o.id}`} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium">
                                                    <Eye className="h-4 w-4" />
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {total > perPage && (
                        <div className="mt-8 flex justify-center">
                            <Pagination
                                page={page}
                                perPage={perPage}
                                total={total}
                                onChange={(p) => setPage(p)}
                                rounded // green filled current page like your design
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
