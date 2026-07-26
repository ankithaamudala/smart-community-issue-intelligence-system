const HOURS_PER_DAY = 24;

export const getTimeFactor = (createdAt, status) => {
  if (status === "Resolved") {
    return 0;
  }
  const elapsedHours = Math.max(
    0,
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60)
  );
  return Number((elapsedHours / HOURS_PER_DAY).toFixed(2));
};

export const calculatePriorityScore = ({ upvoteCount, commentCount, timeFactor }) => {
  return Number((upvoteCount * 2 + commentCount + timeFactor).toFixed(2));
};

export const enrichIssue = (issue, commentCount = 0) => {
  const upvoteCount = Array.isArray(issue.upvotes) ? issue.upvotes.length : 0;
  const timeFactor = getTimeFactor(issue.createdAt, issue.status);
  const priorityScore = calculatePriorityScore({ upvoteCount, commentCount, timeFactor });

  return {
    ...issue,
    upvoteCount,
    commentCount,
    timeFactor,
    priorityScore
  };
};

export const sortIssuesByPriority = (issues) => {
  return [...issues].sort((a, b) => {
    if (b.priorityScore === a.priorityScore) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return b.priorityScore - a.priorityScore;
  });
};

