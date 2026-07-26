import Comment from "../models/Comment.js";
import Issue from "../models/Issue.js";
import { notifyUsersForNewIssue, createNotification } from "../services/notificationService.js";
import { enrichIssue, sortIssuesByPriority } from "../services/priorityService.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const VALID_STATUS = ["Pending", "In Progress", "Resolved"];

const getCommentCountsMap = async (issueIds) => {
  const result = await Comment.aggregate([
    {
      $match: {
        issueId: { $in: issueIds }
      }
    },
    {
      $group: {
        _id: "$issueId",
        count: { $sum: 1 }
      }
    }
  ]);

  return new Map(result.map((item) => [String(item._id), item.count]));
};

export const createIssue = asyncHandler(async (req, res) => {
  const { title, description, category, latitude, longitude } = req.body;

  if (!title || !description || !category || latitude === undefined || longitude === undefined) {
    throw new AppError("Title, description, category, latitude, and longitude are required.", 400);
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new AppError("Latitude and longitude must be valid numbers.", 400);
  }

  const image = req.file ? `/${process.env.UPLOAD_DIR || "uploads"}/${req.file.filename}` : "";

  const issue = await Issue.create({
    title,
    description,
    category,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    image,
    reportedBy: req.user._id
  });

  await notifyUsersForNewIssue({
    issue,
    creator: req.user
  });

  const issueObject = issue.toObject();

  res.status(201).json({
    success: true,
    message: "Issue created successfully.",
    issue: enrichIssue(issueObject, 0)
  });
});

export const getIssues = asyncHandler(async (req, res) => {
  const { category, status, search } = req.query;
  const query = {};

  if (category && category !== "All") {
    query.category = category;
  }

  if (status && status !== "All") {
    query.status = status;
  }

  if (search?.trim()) {
    const regex = { $regex: search.trim(), $options: "i" };
    query.$or = [{ title: regex }, { description: regex }];
  }

  const issues = await Issue.find(query).populate("reportedBy", "name").lean();
  if (!issues.length) {
    res.json({ success: true, count: 0, issues: [] });
    return;
  }

  const issueIds = issues.map((issue) => issue._id);
  const commentCountsMap = await getCommentCountsMap(issueIds);

  const enriched = sortIssuesByPriority(
    issues.map((issue) => enrichIssue(issue, commentCountsMap.get(String(issue._id)) || 0))
  );

  res.json({
    success: true,
    count: enriched.length,
    issues: enriched
  });
});

export const getIssueById = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate("reportedBy", "name location").lean();
  if (!issue) {
    throw new AppError("Issue not found.", 404);
  }

  const comments = await Comment.find({ issueId: issue._id })
    .populate("userId", "name location")
    .sort({ createdAt: -1 })
    .lean();

  const enrichedIssue = enrichIssue(issue, comments.length);

  res.json({
    success: true,
    issue: enrichedIssue,
    comments
  });
});

export const updateIssueStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUS.includes(status)) {
    throw new AppError("Invalid status value.", 400);
  }

  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    throw new AppError("Issue not found.", 404);
  }

  const statusChanged = issue.status !== status;
  issue.status = status;
  await issue.save();

  const commentCount = await Comment.countDocuments({ issueId: issue._id });
  const enrichedIssue = enrichIssue(issue.toObject(), commentCount);

  if (statusChanged && issue.reportedBy.toString() !== req.user._id.toString()) {
    await createNotification({
      userId: issue.reportedBy,
      issueId: issue._id,
      message: `Issue "${issue.title}" status updated to ${status}.`
    });
  }

  res.json({
    success: true,
    message: "Issue status updated successfully.",
    issue: enrichedIssue
  });
});

