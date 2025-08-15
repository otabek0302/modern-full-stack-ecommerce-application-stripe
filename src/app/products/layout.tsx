import React from "react";

const ProductsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <section className="relative py-10">
            <div className="container mx-auto px-4 lg:px-6">{children}</div>
        </section>
    );
};

export default ProductsLayout;
