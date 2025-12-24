import { Schema, model, models, type Document } from "mongoose"


export interface IBlog extends Document {
    title : string,
    author : string,
    content : string,
    tags : string[],
    published : boolean,
    createdAt : Date,
    updatedAt : Date
}

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
        timestamps: true,
    },

)

const Blog = models.Blog || model<IBlog>("Blog", BlogSchema)