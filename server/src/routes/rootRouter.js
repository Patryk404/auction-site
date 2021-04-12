import express from "express";
import userSessionsRouter from "./api/v1/userSessionsRouter.js";
import usersRouter from "./api/v1/usersRouter.js";
import clientRouter from "./clientRouter.js";
import crawlRouter from "./api/v1/crawlRouter.js";
import crawlDeanRouter from "./api/v1/crawlDeanRouter.js";
const rootRouter = new express.Router();
rootRouter.use("/", clientRouter);

rootRouter.use("/api/v1/user-sessions", userSessionsRouter);
rootRouter.use("/api/v1/users", usersRouter); //place your server-side routes here
rootRouter.use("/api/v1/crawl", crawlRouter);
rootRouter.use("/api/v1/crawlDean", crawlDeanRouter);

export default rootRouter;
