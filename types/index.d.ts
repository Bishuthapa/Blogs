import {type Document} from "mongoose"

export interface IBlog extends Document {
    title : string,
    author : string,
    content : string,
    tags : string[],
    published : boolean,
    createdAt : Date,
    updatedAt : Date
}


export interface creatBlog {
    title: string,
    author : string,
    content : string,
    tags : string[]
}