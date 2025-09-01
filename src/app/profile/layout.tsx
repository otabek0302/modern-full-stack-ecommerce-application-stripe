import React from "react";
import ProfileSidebar from "@/components/sections/profile/profile-sidebar";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <section className="relative py-6">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex gap-6">
                    <div className="w-80 flex-shrink-0">
                        <ProfileSidebar />
                    </div>
                    <div className="flex-1 min-w-0">{children}</div>
                </div>
            </div>
        </section>
    );
};

export default ProfileLayout;
