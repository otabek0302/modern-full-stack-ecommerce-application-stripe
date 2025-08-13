import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Home = () => {
    const features = [
        {
            title: "Premium Quality",
            description: "We source only the finest products to ensure your satisfaction.",
            icon: "🌟"
        },
        {
            title: "Fast Shipping",
            description: "Get your orders delivered quickly and securely to your doorstep.",
            icon: "🚚"
        },
        {
            title: "24/7 Support",
            description: "Our customer support team is always here to help you.",
            icon: "💬"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-[#1B5FFE] to-[#1B5FFE]/80 py-12 md:py-20 px-4">
                <div className="max-w-7xl mx-auto text-center text-white">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                        Welcome to Ecobazar
                    </h1>
                    <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                        Your premium destination for quality products. Discover amazing deals and shop with confidence.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                        <Button size="lg" variant="secondary" className="bg-white text-[#1B5FFE] hover:bg-gray-100">
                            Shop Now
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#1B5FFE]">
                            Learn More
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 md:py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-900 px-4">
                        Why Choose Ecobazar?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {features.map((feature, index) => (
                            <Card key={feature.title} className="text-center border-2 hover:border-[#1B5FFE] transition-colors hover:shadow-lg">
                                <CardHeader>
                                    <div className="text-4xl mb-4">{feature.icon}</div>
                                    <CardTitle className="text-lg md:text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-sm md:text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-100 py-12 md:py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-900 px-4">
                        Ready to Start Shopping?
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 px-4">
                        Join thousands of satisfied customers who trust Ecobazar for their shopping needs.
                    </p>
                    <Button size="lg" className="bg-[#1B5FFE] hover:bg-[#1B5FFE]/90 text-white px-6 md:px-8 py-3">
                        Explore Products
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default Home;
