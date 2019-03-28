import { User } from "../../user/model/user";
import { Comment } from "./comment";

export interface Post {
  title: string;
  author: User;
  body: string;
  postId: number;
  views: number;
  comments: Comment[];
  maxPage: number;
  createdAt: Date;
  createdDate: string;
  createdTime: string;
  updatedAt: Date;
  updatedDate: string;
  updatedTime: string;
}
