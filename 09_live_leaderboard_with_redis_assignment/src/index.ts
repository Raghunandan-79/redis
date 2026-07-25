import express from "express";

import postRouter from "./routes/post.routes";
import leaderboardRouter from "./routes/leaderboard.routes";

const app = express();

app.use(express.json());

app.use("/post", postRouter);
app.use("/leaderboard", leaderboardRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});