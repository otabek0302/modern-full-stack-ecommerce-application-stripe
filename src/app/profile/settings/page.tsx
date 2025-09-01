"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Upload, User, MapPin, Lock, Globe } from "lucide-react";
import { useUserContext } from "@/contexts/user-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { urlFor } from "@/lib/sanity.client";
import { fetchCountries, Country } from "@/lib/countries.utils";

export default function ProfileSettings() {
    const { user, isAuthenticated, loading, setUser } = useUserContext();

    const router = useRouter();

    useEffect(() => {
        if (!loading && (!isAuthenticated || !user)) {
            router.push("/auth/sign-in");
        }
    }, [loading, isAuthenticated, user, router]);

    // Form state management
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
    });

    // UI state management
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    const [changingPass, setChangingPass] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Country API state
    const [countries, setCountries] = useState<Country[]>([]);
    const [loadingCountries, setLoadingCountries] = useState(true);
    const [countriesError, setCountriesError] = useState<string | null>(null);

    const avatarFileRef = useRef<HTMLInputElement>(null);

    // Fetch countries from API
    useEffect(() => {
        const loadCountries = async () => {
            try {
                setLoadingCountries(true);
                setCountriesError(null);

                const countriesData = await fetchCountries();
                setCountries(countriesData);
            } catch (error) {
                console.error("Error loading countries:", error);
                setCountriesError("Failed to load countries. Please refresh the page.");
            } finally {
                setLoadingCountries(false);
            }
        };

        loadCountries();
    }, []);

    // Update form when user data changes
    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                street: user.address?.street || "",
                city: user.address?.city || "",
                state: user.address?.state || "",
                zipCode: user.address?.zipCode || "",
                country: user.address?.country || "",
            });
        }
    }, [user]);

    if (loading || !user) return null;

    // Avatar handling
    const handleAvatarChoose = () => avatarFileRef.current?.click();

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Please select a valid image file (JPEG, PNG, or WebP)");
            return;
        }

        setAvatarPreview(URL.createObjectURL(file));
    };

    // Form submission
    const handleSaveProfile = async () => {
        try {
            setSaving(true);

            // Client-side validation
            if (!form.name.trim()) {
                toast.error("Name is required");
                return;
            }

            if (!form.email.trim()) {
                toast.error("Email is required");
                return;
            }

            const formData = new FormData();
            formData.append("userId", user._id);
            formData.append("name", form.name.trim());
            formData.append("email", form.email.trim());
            formData.append("phone", form.phone.trim());
            formData.append("street", form.street.trim());
            formData.append("city", form.city.trim());
            formData.append("state", form.state.trim());
            formData.append("zipCode", form.zipCode.trim());
            formData.append("country", form.country.trim());

            const avatarFile = avatarFileRef.current?.files?.[0];
            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            const response = await fetch("/api/account/update", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || data.message || "Update failed");
                return;
            }

            // Update user context with new data
            setUser(data.user);
            toast.success("Profile updated successfully");

            // Reset avatar preview
            setAvatarPreview(null);
            if (avatarFileRef.current) {
                avatarFileRef.current.value = "";
            }
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Could not save changes. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // Password change
    const handlePasswordChange = async () => {
        const currentPassword = (document.getElementById("currentPassword") as HTMLInputElement)?.value;
        const newPassword = (document.getElementById("newPassword") as HTMLInputElement)?.value;
        const confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement)?.value;

        // Client-side validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All password fields are required");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (currentPassword === newPassword) {
            toast.error("New password must be different from current password");
            return;
        }

        try {
            setChangingPass(true);

            const response = await fetch("/api/account/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user._id,
                    current: currentPassword,
                    next: newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || data.message || "Password change failed");
                return;
            }

            toast.success("Password changed successfully");

            // Clear password fields
            (document.getElementById("currentPassword") as HTMLInputElement).value = "";
            (document.getElementById("newPassword") as HTMLInputElement).value = "";
            (document.getElementById("confirmPassword") as HTMLInputElement).value = "";
        } catch (error) {
            console.error("Password change error:", error);
            toast.error("Password change failed. Please try again.");
        } finally {
            setChangingPass(false);
        }
    };

    // Form field update helper
    const updateFormField = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // Helper function to get avatar URL
    const getAvatarUrl = () => {
        if (avatarPreview) return avatarPreview;
        if (user?.avatar) return urlFor(user.avatar.asset._ref).url();
        return null;
    };

    return (
        <div className="space-y-8">
            {/* Account Settings */}
            <Card className="border border-gray-200 rounded-lg shadow-none">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-900">Account Settings</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Form Fields */}
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                    Full Name *
                                </Label>
                                <Input id="name" value={form.name} onChange={(e) => updateFormField("name", e.target.value)} className="border-gray-200 focus:border-primary focus:ring-primary" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email Address *
                                </Label>
                                <Input id="email" type="email" value={form.email} onChange={(e) => updateFormField("email", e.target.value)} className="border-gray-200 focus:border-primary focus:ring-primary" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                    Phone Number
                                </Label>
                                <Input id="phone" value={form.phone} onChange={(e) => updateFormField("phone", e.target.value)} className="border-gray-200 focus:border-primary focus:ring-primary" />
                            </div>
                        </div>

                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative h-32 w-32 overflow-hidden rounded-full bg-gray-100 border-4 border-gray-200">
                                {getAvatarUrl() ? (
                                    <Image src={getAvatarUrl()!} alt="Avatar" fill sizes="120px" className="object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-gray-500">
                                        {form.name
                                            ?.split(" ")
                                            .map((s) => s[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>

                            <input ref={avatarFileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />

                            <Button variant="outline" onClick={handleAvatarChoose} className="border-primary text-primary hover:bg-primary/5">
                                <Upload className="mr-2 h-4 w-4" />
                                Choose Image
                            </Button>

                            {avatarPreview && <p className="text-xs text-gray-500 text-center">New image selected. Click &quot;Save Changes&quot; to upload.</p>}
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <Button disabled={saving} onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90 text-white px-6">
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Billing Address */}
            <Card className="border border-gray-200 rounded-lg shadow-none">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-900">Billing Address</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="street" className="text-sm font-medium text-gray-700">
                                Street Address
                            </Label>
                            <Input id="street" value={form.street} onChange={(e) => updateFormField("street", e.target.value)} className="border-gray-200 focus:border-primary focus:ring-primary" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                                City
                            </Label>
                            <Input id="city" value={form.city} onChange={(e) => updateFormField("city", e.target.value)} className="border-gray-200 focus:border-primary focus:ring-primary" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                                State
                            </Label>
                            <Input id="state" value={form.state} onChange={(e) => updateFormField("state", e.target.value)} className="border-gray-200 focus:border-primary focus:ring-primary" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                                ZIP Code
                            </Label>
                            <Input id="zipCode" value={form.zipCode} onChange={(e) => updateFormField("zipCode", e.target.value)} className="border-gray-200 focus:border-primary focus:ring-primary" />
                        </div>

                        <div className="space-y-2 lg:col-span-2">
                            <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                                Country
                            </Label>
                            <Select value={form.country} onValueChange={(value) => updateFormField("country", value)} disabled={loadingCountries}>
                                <SelectTrigger className="w-full border-gray-200 focus:border-primary focus:ring-primary">
                                    <SelectValue placeholder={loadingCountries ? "Loading countries..." : "Select country"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {loadingCountries ? (
                                        <div className="flex items-center justify-center py-4 text-sm text-gray-500">
                                            <Globe className="mr-2 h-4 w-4 animate-spin" />
                                            Loading countries...
                                        </div>
                                    ) : countriesError ? (
                                        <div className="py-4 text-center text-sm text-red-500">{countriesError}</div>
                                    ) : (
                                        countries.map((country) => (
                                            <SelectItem key={country.cca3} value={country.name.common} className="flex items-center gap-2">
                                                <span className="mr-2">{country.flag}</span>
                                                {country.name.common}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <Button disabled={saving} onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90 text-white px-6">
                            {saving ? "Saving..." : "Save Address"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="border border-gray-200 rounded-lg shadow-none">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Lock className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-900">Change Password</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-5 max-w-md">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                                Current Password *
                            </Label>
                            <div className="relative">
                                <Input id="currentPassword" type={showCurrentPassword ? "text" : "password"} className="pr-10 border-gray-200 focus:border-primary focus:ring-primary" />
                                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                                New Password *
                            </Label>
                            <div className="relative">
                                <Input id="newPassword" type={showNewPassword ? "text" : "password"} className="pr-10 border-gray-200 focus:border-primary focus:ring-primary" />
                                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowNewPassword(!showNewPassword)}>
                                    {showNewPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                Confirm New Password *
                            </Label>
                            <div className="relative">
                                <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} className="pr-10 border-gray-200 focus:border-primary focus:ring-primary" />
                                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <Button disabled={changingPass} onClick={handlePasswordChange} className="bg-primary hover:bg-primary/90 text-white px-6">
                            {changingPass ? "Changing..." : "Change Password"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
