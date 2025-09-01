"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/contexts/user-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { isAuthenticated, loading, login } = useUserContext();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && !loading) {
            router.push("/");
        }
    }, [isAuthenticated, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        try {
            const success = await login(email, password);
            if (success) {
                router.push("/");
            }
        } catch (error) {
            console.error("Sign in error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="flex items-center justify-center">
            <div className="max-w-lg mx-auto w-full px-4">
                <div>
                    <Card className="w-full max-w-md">
                        <CardHeader className="space-y-2">
                            <CardTitle className="text-gray-900 text-2xl font-bold text-center leading-normal">Sign In</CardTitle>
                            <CardDescription className="text-gray-600 text-center font-normal leading-none">Please login account, to continue shopping !</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-900 text-sm font-medium leading-none">
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-600" />
                                        <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 text-gray-900 text-sm font-normal leading-none" required disabled={isSubmitting} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-gray-900 text-sm font-medium leading-none">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-600" />
                                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 text-gray-900 text-sm font-normal leading-none" required disabled={isSubmitting} />
                                        {showPassword ? <EyeOff className="absolute right-3 top-3 h-4 w-4 text-gray-600 cursor-pointer" onClick={() => setShowPassword(!showPassword)} /> : <Eye className="absolute right-3 top-3 h-4 w-4 text-gray-600 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />}
                                    </div>
                                    <div className="flex justify-end">
                                        <Link href="/auth/forgot-password" className="text-gray-600 hover:text-primary text-sm font-medium leading-none">
                                            Forgot Password ?
                                        </Link>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full text-white text-sm font-medium leading-none" disabled={isSubmitting || !email || !password}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing In...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        <span className="mr-1">Don&apos;t have an account ?</span>
                        <Link href="/auth/sign-up" className="text-primary hover:underline font-medium cursor-pointer">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
