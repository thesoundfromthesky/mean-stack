import { User } from "../../user/model/user";

export interface Comment extends Document {
  name: User;
  memo: string;
  deleted: boolean;
  createdAt: Date;
  _id: string;
}
