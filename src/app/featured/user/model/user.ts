export interface User {
  _id: string;
  username: string;
  password: string;
  currentPassword: string;
  newPassword: string;
  passwordConfirmation: string;
  userId: number;
  name: string;
  email: string;
  createdAt: Date;
  createdDate: string;
  createdTime: string;
  updatedAt: Date;
  updatedDate: string;
  updatedTime: string;
}
