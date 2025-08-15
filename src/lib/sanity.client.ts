import { createClient } from "@sanity/client";
import createImageUrlBuilder from "@sanity/image-url";

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
    apiVersion: "2025-01-01",
    useCdn: true,
});

export const urlFor = (source: string) => createImageUrlBuilder(client).image(source);
