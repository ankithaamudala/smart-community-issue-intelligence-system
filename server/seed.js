import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import Comment from "./src/models/Comment.js";
import Issue from "./src/models/Issue.js";
import Notification from "./src/models/Notification.js";
import User from "./src/models/User.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  await Promise.all([
    Notification.deleteMany({}),
    Comment.deleteMany({}),
    Issue.deleteMany({}),
    User.deleteMany({})
  ]);

  const users = [];
  users.push(
    await User.create({
      name: "Ankitha",
      email: "ankitha@example.com",
      password: "Password123",
      location: "HITEC City"
    })
  );
  users.push(
    await User.create({
      name: "Srikar",
      email: "srikar@example.com",
      password: "Password123",
      location: "Jubilee Hills"
    })
  );
  users.push(
    await User.create({
      name: "Asha",
      email: "asha@example.com",
      password: "Password123",
      location: "Kukatpally"
    })
  );
  users.push(
    await User.create({
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      password: "Password123",
      location: "Secunderabad"
    })
  );

  const issueA = await Issue.create({
    title: "Water supply cut off in HITEC City area",
    description:
      "Water pipeline has been damaged for 5 days. Residents are struggling to get drinking water. Need immediate repair from BWSSB.",
    category: "Utilities",
    latitude: 17.3870,
    longitude: 78.5260,
    status: "Pending",
    upvotes: [users[1]._id, users[2]._id],
    reportedBy: users[0]._id,
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000)
  });

  const issueB = await Issue.create({
    title: "Stray dogs creating nuisance near residential area",
    description: "Pack of stray dogs are roaming near schools in the morning and evening, posing a safety threat to children. Animal control needs to intervene.",
    category: "Safety",
    latitude: 17.3850,
    longitude: 78.4867,
    status: "In Progress",
    upvotes: [users[0]._id, users[2]._id, users[3]._id],
    reportedBy: users[1]._id,
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000)
  });

  const issueC = await Issue.create({
    title: "Pothole damage on Kukatpally road",
    description: "Large potholes on the main road are causing accidents and damage to vehicles. Road needs urgent resurfacing by municipal corporation.",
    category: "Infrastructure",
    latitude: 17.4269,
    longitude: 78.5539,
    status: "Resolved",
    upvotes: [users[0]._id],
    reportedBy: users[2]._id,
    createdAt: new Date(Date.now() - 120 * 60 * 60 * 1000)
  });

  await Comment.insertMany([
    {
      issueId: issueA._id,
      userId: users[1]._id,
      text: "We have not had water for 5 days. Schools and hospitals are affected too."
    },
    {
      issueId: issueA._id,
      userId: users[2]._id,
      text: "Same issue in my area. BWSSB should prioritize this immediately."
    },
    {
      issueId: issueB._id,
      userId: users[3]._id,
      text: "Saw these dogs attack a child near the school gate. Animal control must act now."
    }
  ]);

  await Notification.insertMany([
    {
      userId: users[0]._id,
      issueId: issueA._id,
      message: 'Your issue "Water supply cut off in Whitefield area" has new support.',
      isRead: false
    },
    {
      userId: users[1]._id,
      issueId: issueB._id,
      message: 'Issue "Stray dogs creating nuisance near residential area" is now in progress.',
      isRead: true
    },
    {
      userId: users[2]._id,
      issueId: issueC._id,
      message: 'Your issue "Pothole damage on Kukatpally road" was marked resolved.',
      isRead: false
    }
  ]);

  // eslint-disable-next-line no-console
  console.log("Seed complete.");
  // eslint-disable-next-line no-console
  console.log("Sample login: ankitha@example.com / Password123");
  process.exit(0);
};

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Seed failed:", error);
  process.exit(1);
});

