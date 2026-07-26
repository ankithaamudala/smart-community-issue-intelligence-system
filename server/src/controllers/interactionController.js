import Comment from "../models/Comment.js";
import Issue from "../models/Issue.js";
import { createNotification } from "../services/notificationService.js";
import { enrichIssue } from "../services/priorityService.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const upvoteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    throw new AppError("Issue not found.", 404);
  }

  const hasUpvoted = issue.upvotes.some((userId) => userId.toString() === req.user._id.toString());
  if (hasUpvoted) {
    throw new AppError("You already upvoted this issue.", 400);
  }

  const previousUpvotes = issue.upvotes.length;
  issue.upvotes.push(req.user._id);
  await issue.save();

  const commentCount = await Comment.countDocuments({ issueId: issue._id });
  const enrichedIssue = enrichIssue(issue.toObject(), commentCount);

  const threshold = Number(process.env.UPVOTE_THRESHOLD || 10);
  if (previousUpvotes <= threshold && issue.upvotes.length > threshold) {
    await createNotification({
      userId: issue.reportedBy,
      issueId: issue._id,
      message: `Your issue "${issue.title}" has crossed ${threshold} upvotes.`
    });
  }

  res.json({
    success: true,
    message: "Upvote added.",
    issue: enrichedIssue
  });
});

export const commentOnIssue = asyncHandler(async (req, res) => {
  const text = req.body.text?.trim();
  if (!text) {
    throw new AppError("Comment text is required.", 400);
  }

  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    throw new AppError("Issue not found.", 404);
  }

  const comment = await Comment.create({
    issueId: issue._id,
    userId: req.user._id,
    text
  });

  const populatedComment = await Comment.findById(comment._id).populate("userId", "name location").lean();
  const commentCount = await Comment.countDocuments({ issueId: issue._id });

  if (issue.reportedBy.toString() !== req.user._id.toString()) {
    await createNotification({
      userId: issue.reportedBy,
      issueId: issue._id,
      message: `${req.user.name} commented on your issue "${issue.title}".`
    });
  }

  res.status(201).json({
    success: true,
    message: "Comment added.",
    comment: populatedComment,
    issue: enrichIssue(issue.toObject(), commentCount)
  });
});

