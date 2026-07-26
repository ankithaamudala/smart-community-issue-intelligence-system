import express from "express";
import {
  createIssue,
  getIssueById,
  getIssues,
  updateIssueStatus
} from "../controllers/issueController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/").post(protect, upload.single("image"), createIssue).get(getIssues);
router.get("/:id", getIssueById);
router.patch("/:id/status", protect, updateIssueStatus);

export default router;

