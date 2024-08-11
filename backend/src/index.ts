import { Hono } from "hono";
import { cors } from "hono/cors";

import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.get("/pingme",(c)=>{
  return c.json({message:"hello from server"})
})


app.use("/api/v1/*", cors());
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;



