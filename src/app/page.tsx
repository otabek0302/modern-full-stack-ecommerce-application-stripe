import { Hero, PopularCategories, PopularProducts, Stats, DiscountBanners, HotProducts, SocialMedias, ClientTestimonials } from "@/components/sections";
import { client } from "@/lib/sanity.client";

const Home = async () => {
    const sections = await client.fetch(`*[_type == "section"]`);
    const categories = await client.fetch(`*[_type == "category"]`);
    const products = await client.fetch(`*[_type == "product"]{
        _id,
        name,
        slug,
        details,
        description,
        price,
        images,
        tags,
        stockQuantity,
        dimensions,
        features,
        category->{
            _id,
            name
        },
        discount-> {
            _id,
            discount,
            discountType,
            startDate,
            endDate,
            isActive
        }
    }`);
    const reviews = await client.fetch(`*[_type == "review"]`);
    const posts = await client.fetch(`*[_type == "post"]`);
    return (
        <>
            <Hero sections={sections} />
            <Stats />
            <PopularCategories categories={categories} />
            <PopularProducts products={products} />
            <DiscountBanners sections={sections} />
            <HotProducts products={products} />
            <ClientTestimonials reviews={reviews} />
            <SocialMedias posts={posts} />
        </>
    );
};

export default Home;
