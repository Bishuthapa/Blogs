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

export interface updateBlog extends creatBlog{
    id : string
}

export interface IUser extends Document {
    username : string,
    email : string,
    password : string,
    avatar? : string,
    createdAt : Date,
    updatedAt? : Date
}