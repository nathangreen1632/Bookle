import { Book } from "./Book";

export interface User {
  _id: string;
  username: string;
  email: string;
  savedBooks: Book[];
}
