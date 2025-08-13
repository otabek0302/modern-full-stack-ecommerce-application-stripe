import { createClient } from "@sanity/client";

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
    apiVersion: "2025-01-01",
    useCdn: true,
});
