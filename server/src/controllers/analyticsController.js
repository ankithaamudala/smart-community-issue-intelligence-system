import Comment from "../models/Comment.js";
import Issue from "../models/Issue.js";
import { enrichIssue, sortIssuesByPriority } from "../services/priorityService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const CATEGORIES = ["Infrastructure", "Sanitation", "Utilities", "Safety", "Community"];

export const getAnalytics = asyncHandler(async (req, res) => {
  const [totalIssues, resolvedIssues, pendingIssues, inProgressIssues, groupedByCategory, issues] =
    await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: "Resolved" }),
      Issue.countDocuments({ status: "Pending" }),
      Issue.countDocuments({ status: "In Progress" }),
      Issue.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Issue.find().populate("reportedBy", "name location").lean()
    ]);

  const issueIds = issues.map((issue) => issue._id);
  const commentCounts = await Comment.aggregate([
    { $match: { issueId: { $in: issueIds } } },
    { $group: { _id: "$issueId", count: { $sum: 1 } } }
  ]);

  const commentMap = new Map(commentCounts.map((item) => [String(item._id), item.count]));

  const enriched = sortIssuesByPriority(
    issues.map((issue) => enrichIssue(issue, commentMap.get(String(issue._id)) || 0))
  );

  const categoryMap = new Map(groupedByCategory.map((item) => [item._id, item.count]));
  const issuesByCategory = CATEGORIES.map((category) => ({
    category,
    count: categoryMap.get(category) || 0
  }));

  const highPriorityIssues = enriched.filter((item) => item.status !== "Resolved").slice(0, 5);

  res.json({
    success: true,
    stats: {
      totalIssues,
      resolvedIssues,
      pendingIssues,
      inProgressIssues
    },
    issuesByCategory,
    highPriorityIssues
  });
});

