"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemas";
import { structure } from "./src/sanity/structure";

export default defineConfig({
    basePath: "/sanity",
    projectId,
    dataset,
    schema,
    plugins: [
        structureTool({ structure }), 
        visionTool({ defaultApiVersion: apiVersion }),
    ],
});
