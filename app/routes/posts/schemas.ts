// app/schemas/post.ts
import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, { message: "タイトルは必須です" }),
  content: z.string().min(1, { message: "内容は必須です" }),
  content_type: z.string().optional(),
  age: z.string().optional(),
  public: z.boolean().optional(),
  food_orange: z.boolean().optional(),
  food_apple: z.boolean().optional(),
  food_banana: z.boolean().optional(),
  food_melon: z.boolean().optional(),
  food_grape: z.boolean().optional(),
  date_publish: z.string().optional(),
  date_update: z.string().optional(),
  post_number: z.string().optional(),
  address_country: z.string().optional(),
  address_pref: z.string().optional(),
  address_city: z.string().optional(),
  address_1: z.string().optional(),
  address_2: z.string().optional(),
  text_option1: z.string().optional(),
  text_option2: z.string().optional(),
});

export type PostSchemaType = z.infer<typeof postSchema>;