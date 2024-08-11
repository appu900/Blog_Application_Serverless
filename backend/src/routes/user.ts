import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import z from "zod";
import { decode, sign, verify } from "hono/jwt";
import { signupInput } from "../validation/zod";


export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// ** signup route
userRouter.post("/signup", async (c) => {
  // ** creating the prisma client
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // ** getting the body
  const body = await c.req.json();
  const{success, data} = signupInput.safeParse(body);
  if(!success){
    c.status(400);
    return c.json({
      ok: false,
      error: "invalid input",
    })
  }

  try {
    const user = await prisma.user.create({
      data: {
        name:body.name,
        email: body.email,
        password: body.password,
      },
    });

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
      ok: true,
      jwt: token,
    });
  } catch (error: any) {
    c.status(411);
    return c.json({
      ok: false,
      error: error.message,
    });
  }
});

// ** signin route
userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password,
      },
    });

    if (!user) {
      c.status(403);
      return c.json({
        error: "invalid email or password",
      });
    }

    // @ts-ignore
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch (error: any) {
    c.status(403);
    return c.json({
      ok: false,
      error: error.message,
    });
  }
});
