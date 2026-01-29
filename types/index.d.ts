import mongoose, {type Document} from "mongoose"

export interface IBlog extends Document {
    title : string,
    author : mongoose.Types.ObjectId,
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
    isVerified : boolean,
    isAdmine: boolean,
    forgetPasswordToken: string,
    forgetPasswordTokenExpiry: Date,
    verifyToken: string,
    verifyTokenExpiry: Date,
    createdAt : Date,
    updatedAt? : Date,
}
export interface SendEmailParams {
  email: string;
  emailType: "verify" | "reset";
  userId: string;
}