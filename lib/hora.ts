import { Blog } from "@/core/models/Blog.model";
import "@/core/models/User.model";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

export async function getUsersBlogs({id}:any) {
  await connectDB();

  const blogs = await Blog.aggregate([
    { $sort: { createdAt: -1 } },
    {
        $match: {
        author: new mongoose.Types.ObjectId(id),
        },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDoc",
      },
    },
    { $unwind: { path: "$authorDoc", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        tags: 1,
        published: 1,
        createdAt: 1,
        updatedAt: 1,
        author: {
          _id: "$author",
          username: "$authorDoc.username",
          avatar: "$authorDoc.avatar",
        },
      },
    },
  ]);

  return blogs || [];
}
