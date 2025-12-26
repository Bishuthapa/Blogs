import { Schema, model, models} from "mongoose"
import { IBlog } from "@/types";


const BlogSchema = new Schema<IBlog>(
    {
        title:{
            type : String,
            required: [true, "Title is required"],
            trim: true,
            maxlength : [200, "Title cannot exceed 200 characters"],

        },
        author:{
            type: String,
            required: [true, "Author is required"],
            trim: true,
        },
        content:{
            type: String,
            required: [true, "Content is required"]
        },
        tags:{
            type: [String],
            default: [],
        },
        published:{
            type: Boolean,
            default: false,
        },


    },

    {
        timestamps: true, // auto created the timestamp when createdAt & updatedAt
    },

)


BlogSchema.index({createdAt: -1}); /* sorts by creation data */
BlogSchema.index({published: 1}); /* filter by publish status */
BlogSchema.index({tags: 1}); //it will help to search by tags


export const Blog = models.Blog || model<IBlog>("Blog", BlogSchema);