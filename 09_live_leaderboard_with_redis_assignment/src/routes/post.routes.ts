import { Router } from "express";
import { incrementPostView } from "../controllers/post.controller";

const router = Router();

router.post("/:id/view", incrementPostView);

export default router;