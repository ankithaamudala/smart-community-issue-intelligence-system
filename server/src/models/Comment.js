import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      maxlength: 1000
    }
  },
  {
    timestamps: true
  }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;

