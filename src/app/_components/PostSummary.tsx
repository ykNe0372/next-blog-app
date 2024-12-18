"use client";
import dayjs from "dayjs";
import type { Post } from "@/app/_types/Post";
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
        <div>{dayjs(post.createdAt).format(dtFmt)}</div>
        <div className="font-bold">{post.title}</div>
        {/* <div>{post.content}</div> */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </Link>
  );
};

export default PostSummary;
