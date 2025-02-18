import { Category } from "./Category";
import { CoverImage } from "./CoverImage";

export type Post = {
  id: string;
  title: string;
  content: string;
  coverImageKey: string;
  createdAt: string;
  categories: Category[];
};
