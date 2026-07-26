import express from "express";
import { commentOnIssue, upvoteIssue } from "../controllers/interactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:id/upvote", protect, upvoteIssue);
router.post("/:id/comment", protect, commentOnIssue);

export default router;

