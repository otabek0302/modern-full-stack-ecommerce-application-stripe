"use client";


import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

import { useUserContext } from "@/contexts/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ------ helpers -------------------------------------------------------------

const fmtDate = (d: string | Date) =>
    new Intl.DateTimeFormat(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(d));

const fmtMoney = (n: number, currency = "USD") => new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);

type OrderItem = {
    id?: string;
    productId?: string;
    name: string;
    image?: string; // URL
    price: number;
    qty: number;
    subtotal?: number;
};

type OrderShape = {
    _id?: string;
    orderId?: string | number;
    createdAt: string | Date;
    status: "received" | "processing" | "on_the_way" | "delivered" | string;
    paymentMethod?: string; // e.g., "Paypal"
    currency?: string;
    billingAddress?: {
        name?: string;
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
        email?: string;
        phone?: string;
    };
    shippingAddress?: OrderShape["billingAddress"];
    items: OrderItem[];
    subtotal: number;
    discountPercent?: number; // 0–100
    shippingCost?: number; // 0 for "Free"
    total: number;
};

// Map your project’s statuses to step index (1–4)
const statusToStep = (s: string) => {
    const k = s.toLowerCase();
    if (k === "received" || k === "order_received") return 1;
    if (k === "processing") return 2;
    if (k === "on_the_way" || k === "on the way") return 3;
    if (k === "delivered") return 4;
    return 1;
};

// ------ small presentational bits ------------------------------------------

function AddressCard({ title, a }: { title: string; a?: OrderShape["billingAddress"] }) {
    return (
        <Card className="h-full">
            <CardHeader className="border-b py-3">
                <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-4 text-sm">
                <p className="font-semibold">{a?.name || "—"}</p>
                <p className="text-muted-foreground">{[a?.street, a?.city, a?.state, a?.zipCode].filter(Boolean).join(", ")}</p>
                <p className="text-muted-foreground">{a?.country}</p>

                <div className="pt-3 text-xs uppercase text-muted-foreground">Email</div>
                <p className="text-sm text-foreground">{a?.email || "—"}</p>

                <div className="pt-2 text-xs uppercase text-muted-foreground">Phone</div>
                <p className="text-sm text-foreground">{a?.phone || "—"}</p>
            </CardContent>
        </Card>
    );
}

function SummaryCard({ o }: { o: OrderShape }) {
    const currency = o.currency || "USD";
    const discount = typeof o.discountPercent === "number" ? `${o.discountPercent}%` : "—";
    const shipping = typeof o.shippingCost === "number" ? (o.shippingCost === 0 ? "Free" : fmtMoney(o.shippingCost, currency)) : "—";

    return (
        <Card className="h-full">
            <CardHeader className="border-b py-3">
                <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <span className="mr-6">Order ID: </span>
                    <span className="text-foreground">#{String(o.orderId ?? o._id ?? "")}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-4 text-sm">
                <div className="grid grid-cols-2">
                    <span className="text-muted-foreground uppercase text-xs">Payment Method:</span>
                    <span className="justify-self-end text-foreground">{o.paymentMethod || "—"}</span>
                </div>

                <div className="grid grid-cols-2 pt-2">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="justify-self-end font-medium">{fmtMoney(o.subtotal, currency)}</span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="justify-self-end">{discount}</span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="justify-self-end">{shipping}</span>
                </div>
                <div className="grid grid-cols-2 pt-1">
                    <span className="text-muted-foreground">Total</span>
                    <span className="justify-self-end text-lg font-extrabold text-primary">{fmtMoney(o.total, currency)}</span>
                </div>
            </CardContent>
        </Card>
    );
}

function StatusTracker({ step }: { step: number }) {
    const steps = [
        { id: 1, labelTop: "01", labelBottom: "Order received" },
        { id: 2, labelTop: "02", labelBottom: "Processing" },
        { id: 3, labelTop: "03", labelBottom: "On the way" },
        { id: 4, labelTop: "04", labelBottom: "Delivered" },
    ];

    return (
        <div className="rounded-lg border p-6">
            <div className="relative mx-auto max-w-3xl">
                {/* line */}
                <div className="absolute left-0 right-0 top-5 h-1 rounded bg-muted" />
                <div className="absolute left-0 top-5 h-1 rounded bg-primary transition-all" style={{ width: `${((step - 1) / 3) * 100}%` }} />

                {/* nodes */}
                <div className="relative z-10 grid grid-cols-4 items-start">
                    {steps.map((s, i) => {
                        const active = s.id <= step;
                        return (
                            <div key={s.id} className="flex flex-col items-center gap-2 text-center">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${active ? "border-primary bg-primary text-white" : "border-primary/30 bg-white text-primary"}`}>{active && s.id === 1 ? <Check className="h-5 w-5" /> : <span className="text-sm font-semibold">{s.labelTop}</span>}</div>
                                <div className={`text-sm ${active ? "text-primary" : "text-muted-foreground"}`}>{s.labelBottom}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function ItemsTable({ items, currency }: { items: OrderItem[]; currency: string }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Quantity</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((it, idx) => (
                        <tr key={it.id ?? it.productId ?? idx} className="border-b">
                            <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                    {it.image ? (
                                        <div className="relative h-12 w-12 overflow-hidden rounded">
                                            <img src={it.image} alt={it.name} className="object-cover w-full h-full" />
                                        </div>
                                    ) : (
                                        <div className="h-12 w-12 rounded bg-muted" />
                                    )}
                                    <span className="font-medium">{it.name}</span>
                                </div>
                            </td>
                            <td className="px-4 py-4">{fmtMoney(it.price, currency)}</td>
                            <td className="px-4 py-4">x{it.qty}</td>
                            <td className="px-4 py-4 font-semibold">{fmtMoney(it.subtotal ?? it.price * it.qty, currency)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ------ page ---------------------------------------------------------------

export default function SingleOrderPage({ params }: { params: { id: string } }) {
    const { user } = useUserContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [order, setOrder] = useState<OrderShape | null>(null);

    // Fetch the specific order
    useEffect(() => {
        const fetchOrder = async () => {
            if (!user?._id) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/user/orders?userId=${user._id}&orderId=${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.order) {
                        // Transform API response to expected OrderShape format
                        const transformedOrder: OrderShape = {
                            _id: data.order._id,
                            orderId: data.order._id,
                            createdAt: data.order.createdAt || data.order._createdAt,
                            status: data.order.status || 'processing',
                            paymentMethod: data.order.paymentMethod || 'Unknown',
                            currency: 'USD',
                            shippingAddress: data.order.shippingAddress ? {
                                name: `${user.name || ''}`.trim(),
                                email: user.email,
                                phone: user.phone || '',
                                street: data.order.shippingAddress.street || '',
                                city: data.order.shippingAddress.city || '',
                                state: data.order.shippingAddress.state || '',
                                zipCode: data.order.shippingAddress.zipCode || '',
                                country: data.order.shippingAddress.country || ''
                            } : undefined,
                            items: data.order.products?.map((product: { _id: string; name: string; price: number; images?: string[] }, index: number) => ({
                                id: product._id,
                                productId: product._id,
                                name: product.name || 'Unknown Product',
                                image: product.images?.[0] || '',
                                price: product.price || 0,
                                qty: 1, // Default quantity since we don't have it in the API response
                                subtotal: product.price || 0
                            })) || [],
                            subtotal: data.order.subtotal || data.order.totalPrice || 0,
                            shippingCost: data.order.shipping || 0,
                            total: data.order.totalPrice || 0
                        };
                        setOrder(transformedOrder);
                    } else {
                        setError('Order not found');
                    }
                } else {
                    setError('Failed to fetch order');
                }
            } catch (error) {
                console.error('Error fetching order:', error);
                setError('Failed to fetch order');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [user?._id, params.id]);

    // Loading state
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Order Details</h1>
                    <Button asChild variant="link" className="text-primary">
                        <Link href="/profile/orders">
                            <ChevronLeft className="mr-1 h-4 w-4" /> Back to List
                        </Link>
                    </Button>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-gray-600">Loading order...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !order) {
        notFound();
    }

    const step = statusToStep(order.status);
    const productCount = order.items?.reduce((acc, it) => acc + (it.qty ?? 0), 0) ?? 0;

    return (
        <div className="space-y-6">
            {/* Header row */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">
                    Order Details • {fmtDate(order.createdAt)} • {productCount} {productCount === 1 ? "Product" : "Products"}
                </h1>

                <Button asChild variant="link" className="text-primary">
                    <Link href="/profile/orders">
                        <ChevronLeft className="mr-1 h-4 w-4" /> Back to List
                    </Link>
                </Button>
            </div>

            {/* Top cards */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <AddressCard title="Shipping Address" a={order.shippingAddress} />
                <SummaryCard o={order} />
            </div>

            {/* Status tracker */}
            <StatusTracker step={step} />

            {/* Items */}
            <Card>
                <CardHeader className="border-b py-3">
                    <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Items</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ItemsTable items={order.items} currency={order.currency || "USD"} />
                </CardContent>
            </Card>
        </div>
    );
}
