import z from "zod";
export const signupInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const createPostInput = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export type SignupInput = z.infer<typeof signupInput>;
export type signinInput = z.infer<typeof signinInput>;
export type CreatePostInput = z.infer<typeof signinInput>;
