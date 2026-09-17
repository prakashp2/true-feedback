import {z} from "zod";

export const messageSchema = z.object({
    content: z
        .string()
        .min(10, {message: 'Message content must be at least 10 characters long'})
        .max(200, {message: 'Message content must be at most 200 characters long'})
});
