import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const createNotification = async ({ userId, message, issueId = null }) => {
  if (!userId || !message) {
    return null;
  }

  return Notification.create({
    userId,
    message,
    issueId
  });
};

export const notifyUsersForNewIssue = async ({ issue, creator }) => {
  const sameLocationRecipients = await User.find({
    _id: { $ne: creator._id },
    location: creator.location
  }).select("_id");

  const recipients =
    sameLocationRecipients.length > 0
      ? sameLocationRecipients
      : await User.find({ _id: { $ne: creator._id } }).select("_id");

  if (!recipients.length) {
    return;
  }

  const notificationDocs = recipients.map((recipient) => ({
    userId: recipient._id,
    message: `New issue reported: "${issue.title}" in ${issue.location}.`,
    issueId: issue._id
  }));

  await Notification.insertMany(notificationDocs);
};

