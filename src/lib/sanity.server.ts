import "server-only";
import { createClient } from "@sanity/client";

export const serverClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
    token: process.env.SANITY_DEVELOPMENT_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN,
    useCdn: false,
    perspective: (process.env.SANITY_DEVELOPMENT_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN) ? "raw" : "published",
});
