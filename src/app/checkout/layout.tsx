import React from "react";

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <section className="relative py-6 min-h-screen">
            <div className="container mx-auto px-4 lg:px-6">
                {children}
            </div>
        </section>
    );
};

export default CheckoutLayout;
