import type { Request, Response } from "express";
import { redis } from "../config/redis";

const LEADERBOARD_KEY = "leaderboard";

export const addScore = async (req: Request, res: Response) => {
  const { userId, points } = req.body;

  if (!userId || typeof points !== "number") {
    return res.status(400).json({
      message: "userId and points are required",
    });
  }

  const score = await redis.zincrby(LEADERBOARD_KEY, points, userId);

  return res.json({
    userId,
    score: Number(score),
  });
};

export const getLeaderboard = async (req: Request, res: Response) => {
  const result = await redis.zrange(LEADERBOARD_KEY, 0, 9, "REV", "WITHSCORES");

  const leaderboard = [];

  for (let i = 0; i < result.length; i += 2) {
    leaderboard.push({
      rank: i / 2 + 1,
      userId: result[i],
      score: Number(result[i + 1]),
    });
  }

  return res.json({ leaderboard });
};

export const getUserRank = async (req: Request, res: Response) => {
    const { userId } = req.params;
  
    if (typeof userId !== "string") {
      return res.status(400).json({
        message: "Invalid userId",
      });
    }
  
    const [rank, score] = await Promise.all([
      redis.zrevrank(LEADERBOARD_KEY, userId),
      redis.zscore(LEADERBOARD_KEY, userId),
    ]);
  
    if (rank === null) {
      return res.status(404).json({
        message: "User not found",
      });
    }
  
    return res.json({
      userId,
      rank: rank + 1,
      score: Number(score),
    });
  };