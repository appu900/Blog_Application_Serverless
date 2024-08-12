import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, verify } from "hono/jwt";
import { S3Client, PutObjectCommand, S3 } from "@aws-sdk/client-s3";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";
  if (!authHeader) {
    c.status(401);
    return c.json({ ok: false, error: "please login" });
  }
  const user = await verify(authHeader, c.env.JWT_SECRET);
  if (user && typeof user.id === "string") {
    c.set("userId", user.id);
    await next();
  } else {
    c.status(401);
    return c.json({ ok: false, error: "please login" });
  }
});

blogRouter.post("/", async (c) => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // const s3Client = new S3Client({
  //   region:c.env.
  // })

  const form = await c.req.formData();
  const file = form.get("file");
  const title = form.get("title");
  const content = form.get("content");

  if (!(file instanceof File)) {
    c.status(400);
    return c.json({ error: "file upload is required" });
  }

  const fileName = file.name;
  const arrayBuffer = await file.arrayBuffer();
  const fileContent = new Uint8Array(arrayBuffer);

  const uploadParams = {
    Bucket: "",
    Key: "",
    Body: "",
    ContentType: file.type,
  };

  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: userId,
    },
  });

  return c.json({
    ok: true,
    id: post.id,
  });
});

blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const post = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return c.json({ ok: true, id: post.id });
});

blogRouter.get("/:id", async (c) => {
  const blogId = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: blogId,
      },
    });
    return c.json({ ok: true, post: post });
  } catch (error) {
    c.status(404);
    return c.json({ ok: false, error: "post not found" });
  }
});

blogRouter.get("/bulk/all", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const posts = await prisma.post.findMany({
    select: {
      content: true,
      title: true,
      id: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });
  return c.json({ ok: true, posts: posts });
});
