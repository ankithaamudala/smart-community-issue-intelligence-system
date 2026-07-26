import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 140
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 1500
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },
    latitude: {
      type: Number,
      required: [true, "Latitude is required"]
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required"]
    },
    image: {
      type: String,
      default: ""
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending"
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

issueSchema.index({ title: "text", description: "text" });
issueSchema.index({ latitude: 1, longitude: 1 });

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;

