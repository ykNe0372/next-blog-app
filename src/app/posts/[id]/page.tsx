"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import type { Post } from "@/app/_types/Post";
import dummyPosts from "@/app/_mocks/dummyPosts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";

// 投稿記事の詳細表示 /posts/[id]
const Page: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dtFmt = "YYYY-MM-DD";

  // 動的ルートパラメータから記事 id を取得
  const { id } = useParams() as { id: string };

  // コンポーネントが読み込まれた時一回だけ実行する
  useEffect(() => {
    setIsLoading(true); // モックデータを使用 (API 叩くのはもうちょい先)
    const timer = setTimeout(() => {
      console.log("ウェブ API からデータを取得しました (してない)");
      setPost(dummyPosts.find((post) => post.id === id) || null); // dummyPosts から id に一致する投稿を取得➡セット
      setIsLoading(false);
    }, 1000);

    // データ取得の途中でページ遷移した時にタイマーを解除する
    return () => clearTimeout(timer);
  }, [id]);

  // 投稿データの取得中は Loading...
  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  // 投稿データが取得できなければエラーを表示
  if (!post) {
    return <div>指定 id の投稿の取得に失敗しました。</div>;
  }

  // HTML コンテンツのサニタイズ
  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });

  return (
    <main>
      <div className="space-y-2">
        <div>{dayjs(post.createdAt).format(dtFmt)}</div>
        <div className="mb-2 text-2xl font-bold">{post.title}</div>
        <div>
          <Image
            src={post.coverImage.url}
            alt="Example Image"
            width={post.coverImage.width}
            height={post.coverImage.height}
            priority
            className="rounded-xl"
          />
        </div>
        <div dangerouslySetInnerHTML={{ __html: safeHTML }}></div>
      </div>
    </main>
  );
};

export default Page;
