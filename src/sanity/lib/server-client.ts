import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "../env";

export const serverClient = createClient({
    projectId,
    dataset,
    apiVersion,
    token: process.env.SANITY_DEVELOPMENT_TOKEN,
    useCdn: false,
    perspective: "raw",
}); 