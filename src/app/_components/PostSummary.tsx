"use client";
import dayjs from "dayjs";
import type { Post } from "@/app/_types/Post";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

type Props = {
  post: Post;
};

const PostSummary: React.FC<Props> = (props) => {
  const { post } = props;
  const dtFmt = "YYYY-MM-DD";
  return (
    <Link href={`/posts/${post.id}`}>
      <div className="mb-4 border border-slate-400 p-3">
        <div className="flex items-center justify-between">
          <div>{dayjs(post.createdAt).format(dtFmt)}</div>
          <div className="flex space-x-1.5">
            {post.categories.map((category) => (
              <div
                key={category.id}
                className={twMerge(
                  "rounded-md px-2 py-0.5",
                  "text-xs font-bold",
                  "border border-slate-400 text-slate-500"
                )}
              >
                <Link href={`/admin/categories/${category.id}`}>
                  {category.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="font-bold">{post.title}</div>
        {/* <div>{post.content}</div> */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </Link>
  );
};

export default PostSummary;
