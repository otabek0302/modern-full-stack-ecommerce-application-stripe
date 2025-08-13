import { type SchemaTypeDefinition } from "sanity";
import { product } from "./product";
import { category } from "./category";
import { banner } from "./banner";

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [product, category, banner],
};
