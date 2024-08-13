import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, verify } from "hono/jwt";
import { Upload } from "@aws-sdk/lib-storage";
import {
  S3Client,
  PutObjectCommand,
  S3,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    AWS_ACCESS_KEY_ID: any;
    AWS_SECRET_ACCESS_KEY: any;
    AWS_BUCKET_NAME: any;
    AWS_REGION: any;
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

// ** crate a post route

blogRouter.post("/", async (c) => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const s3 = new S3Client({
    credentials: {
      accessKeyId: c.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: c.env.AWS_SECRET_ACCESS_KEY,
    },
    region: c.env.AWS_REGION,
  });

  const form = await c.req.formData();
  const file = form.get("img");
  const postTitle = form.get("title");
  const postContent = form.get("content");

  if (postTitle === null || postContent === null) {
    c.status(400);
    return c.json({
      error: "Content or title is required",
    });
  }

  if (!(file instanceof File)) {
    c.status(400);
    return c.json({ error: "file upload is required" });
  }

  const fileName = file.name;
  const arrayBuffer = await file.arrayBuffer();
  const fileContent = new Uint8Array(arrayBuffer);

  const uploadParams = {
    Bucket: c.env.AWS_BUCKET_NAME,
    Key: `uploads/${fileName}`,
    Body: fileContent,
    ContentType: file.type,
    ACL: ObjectCannedACL.public_read,
  };

  try {
    const upload = new Upload({
      client: s3,
      params: uploadParams,
    });
    await upload.done();
    const fileUrl = `https://${c.env.AWS_BUCKET_NAME}.s3.${c.env.AWS_REGION}.amazonaws.com/uploads/${fileName}`;

    const response = await prisma.post.create({
      data: {
        content: postContent.toString(),
        title: postTitle.toString(),
        image: fileUrl,
        authorId: userId,
      },
    });

    c.status(201);
    return c.json({
      ok: true,
      data: response,
    });
  } catch (error: any) {
    c.status(500);
    return c.json({
      error: error.message,
    });
  }
});

// ** update a post

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

// ** get a post

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

// ** get all posts

blogRouter.get("/bulk/all", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const posts = await prisma.post.findMany({
    select: {
      content: true,
      title: true,
      id: true,
      likeCount:true,
      author: {
        select: {
          email: true,
        },
      },
    },
  });
  return c.json({ ok: true, posts: posts });
});

// ** like a post

blogRouter.post("/like", async (c) => {
  const userId = c.get("userId");
  const postId = c.req.query("postId") as string;

  if (!userId || !postId) {
    c.status(400);
    return c.json({
      error: "postId is required",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: postId,
          userId: userId,
        },
      },
    });

    if (existingLike) {
      // ** if user already liked the post then just delete the like from like table and decrese like count in post model

      await prisma.$transaction([
        prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        }),

        prisma.post.update({
          where: { id: postId },
          data: { likeCount: { decrement: 1 } },
        }),
      ]);

      c.status(201);
      return c.json({
        ok: true,
      });
    } else {
     
      // ** else create a like row and update the likes in post

      await prisma.$transaction([
        prisma.like.create({
          data: {
            postId: postId,
            userId: userId,
          },
        }),
        prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            likeCount: {
              increment: 1,
            },
          },
        }),
      ]);

      c.status(201);
      return c.json({
        ok: true,
      });
    }
  } catch (error: any) {
    c.status(500);
    return c.json({
      ok: false,
      error: error.message,
    });
  }
});
