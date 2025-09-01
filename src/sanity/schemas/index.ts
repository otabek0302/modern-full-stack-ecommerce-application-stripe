import { type SchemaTypeDefinition } from "sanity";
import { product } from "./product";
import { category } from "./category";
import { section } from "./section";
import { discount } from "./discount";
import { review } from "./review";
import { post } from "./post";
import { user } from "./user";
import { order } from "./order";

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [product, category, discount, section, review, post, user, order],
};
