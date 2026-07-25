import type { Request, Response } from "express";
import { redis } from "../config/redis";

export const incrementPostView = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const views = await redis.incr(`post:${id}:views`);

  return res.json({
    postId: id,
    views,
  });
};