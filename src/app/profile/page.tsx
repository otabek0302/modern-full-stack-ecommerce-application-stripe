"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Edit, User as UserIcon, MapPin, Mail, Phone } from "lucide-react";
import { useUserContext } from "@/contexts/user-context";
import { urlFor } from "@/lib/sanity.client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatStatus } from "@/lib/utils";

export default function ProfilePage() {
    const { user, isAuthenticated } = useUserContext();
    const router = useRouter();

    // If you want to protect the page:
    if (!isAuthenticated || !user) router.push("/auth/sign-in");

    return (
        <div className="space-y-8">
            {/* Top cards */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Profile card */}
                <Card className="border border-gray-200 rounded-lg shadow-none">
                    <CardContent className="flex flex-col items-center gap-4 p-8">
                        <div className="relative h-32 w-32 overflow-hidden bg-primary/10 border-4 border-primary/20 rounded-full">
                            {user?.avatar ? (
                                <Image src={urlFor(user.avatar.asset._ref).width(240).height(240).fit("crop").url()} alt={user?.name || "Avatar"} fill sizes="96px" className="object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-primary/5 border border-primary/20 rounded-full">
                                    <UserIcon className="h-12 w-12 text-primary" />
                                </div>
                            )}
                        </div>

                        <div className="text-center space-y-2">
                            <h2 className="text-gray-900 text-2xl font-bold capitalize">{user?.name}</h2>
                            <p className="text-primary text-sm font-medium cursor-pointer hover:text-primary/80 transition-colors" onClick={() => navigator.clipboard.writeText(user?.email || "")}>
                                {user?.email}
                            </p>
                        </div>

                        <Button variant="outline" asChild className="mt-2 px-6 py-2 border-primary text-primary hover:bg-primary/5">
                            <Link href="/profile/settings">
                                <Edit className="mr-2 h-4 w-4 text-primary" />
                                <span className="text-primary text-sm font-medium">Edit Profile</span>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Billing Address card */}
                <Card className="border border-gray-200 rounded-lg shadow-none">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-xl font-semibold text-gray-900">Billing Address</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-3">
                            <p className="text-gray-900 text-lg font-semibold capitalize">{user?.name}</p>

                            {/* Address Display */}
                            <div className="space-y-2">
                                {user?.address?.street && (
                                    <p className="text-gray-600 text-sm flex items-center gap-2">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                        {user.address.street}
                                    </p>
                                )}
                                {(user?.address?.city || user?.address?.state || user?.address?.zipCode) && (
                                    <p className="text-gray-600 text-sm flex items-center gap-2">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                        {[user.address?.city, user.address?.state, user.address?.zipCode].filter(Boolean).join(", ")}
                                    </p>
                                )}
                                {user?.address?.country && (
                                    <p className="text-gray-600 text-sm flex items-center gap-2">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                        {user.address.country}
                                    </p>
                                )}
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-2 pt-2">
                                {user?.email && (
                                    <p className="text-gray-600 text-sm flex items-center gap-2 cursor-pointer hover:text-primary transition-colors" onClick={() => navigator.clipboard.writeText(user.email || "")}>
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        {user.email}
                                    </p>
                                )}
                                {user?.phone && (
                                    <p className="text-gray-600 text-sm flex items-center gap-2 cursor-pointer hover:text-primary transition-colors" onClick={() => navigator.clipboard.writeText(user.phone || "")}>
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        {user.phone}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Button asChild variant="outline" className="px-6 py-2 border-primary text-primary hover:bg-primary/5">
                            <Link href="/profile/settings">
                                <span className="text-primary text-sm font-medium">Edit Address</span>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Order History */}
            <Card className="border border-gray-200 rounded-lg shadow-none">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold text-gray-900">Recent Order History</CardTitle>
                        <Link href="/profile/orders" className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
                            View All
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="border-b border-gray-200">
                                    <TableHead className="px-4 py-4 text-left font-semibold text-gray-700">Order ID</TableHead>
                                    <TableHead className="px-4 py-4 text-left font-semibold text-gray-700">Date</TableHead>
                                    <TableHead className="px-4 py-4 text-left font-semibold text-gray-700">Total</TableHead>
                                    <TableHead className="px-4 py-4 text-left font-semibold text-gray-700">Status</TableHead>
                                    <TableHead className="px-4 py-4 text-left font-semibold text-gray-700">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {user && user.orders && user.orders.length === 0 ? (
                                    <TableRow>
                                        <TableCell className="px-4 py-8 text-center text-gray-500" colSpan={5}>
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <UserIcon className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <span className="text-gray-500 text-sm">No orders yet.</span>
                                                <p className="text-gray-400 text-xs">Start shopping to see your order history here.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    user?.orders?.map((order) => (
                                        <TableRow key={String(order._id)} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <TableCell className="px-4 py-4 text-gray-900 font-medium">#{String(order._id).slice(-8)}</TableCell>
                                            <TableCell className="px-4 py-4 text-gray-600 text-sm">{formatDate(order.createdAt)}</TableCell>
                                            <TableCell className="px-4 py-4 text-gray-900 font-semibold">${order.totalPrice?.toFixed(2) || "0.00"}</TableCell>
                                            <TableCell className="px-4 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${formatStatus(order.status)}`}>{order.status}</span>
                                            </TableCell>
                                            <TableCell className="px-4 py-4">
                                                <Link href={`/profile/orders/${order._id}`} className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
                                                    View Details
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
