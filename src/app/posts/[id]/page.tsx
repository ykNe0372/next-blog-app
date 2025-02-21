"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import type { Post } from "@/app/_types/Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

import DOMPurify from "isomorphic-dompurify";
import { PostApiResponse } from "@/app/_types/PostApiResponse";

import { supabase } from "@/utils/supabase";
import { markdownToHtml } from "@/app/_components/MarkdownToHtml"; // インポート

// 投稿記事の詳細表示 /posts/[id]
const Page: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>();
  const bucketName = "cover_image";

  // 動的ルートパラメータから id を取得 （URL:/posts/[id]）
  const { id } = useParams() as { id: string };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const requestUrl = `/api/posts/${id}`;
        const response = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const postApiResponse: PostApiResponse = await response.json();
        const htmlContent = markdownToHtml(postApiResponse.content); // マークダウンをHTMLに変換
        console.log(htmlContent);
        setPost({
          id: postApiResponse.id,
          title: postApiResponse.title,
          content: htmlContent, // 変換されたHTMLをセット
          coverImageKey: postApiResponse.coverImageKey,
          createdAt: postApiResponse.createdAt,
          categories: postApiResponse.categories.map((category) => ({
            id: category.category.id,
            name: category.category.name,
          })),
        });
        setCoverImageUrl(
          postApiResponse.coverImageKey
            ? supabase.storage
                .from(bucketName)
                .getPublicUrl(postApiResponse.coverImageKey).data.publicUrl
            : ""
        );
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [id]);

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  // 投稿データの取得中は「Loading...」を表示
  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  // 投稿データが取得できなかったらエラーメッセージを表示
  if (!post) {
    return <div>指定idの投稿の取得に失敗しました。</div>;
  }

  // HTMLコンテンツのサニタイズ
  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: [
      "b",
      "strong",
      "i",
      "em",
      "u",
      "br",
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "blockquote",
      "code",
      "pre",
      "del",
    ], // 必要なタグを追加
    ALLOWED_ATTR: ["href", "target"], // 必要な属性を追加
  });

  return (
    <main>
      <div className="space-y-2">
        <div className="mb-2 text-2xl font-bold">{post.title}</div>
        <div>
          <Image
            src={
              coverImageUrl ||
              "https://via.placeholder.com/1024x768.png?text=No+Image"
            }
            alt="Example Image"
            priority
            className="rounded-xl"
            width={1024}
            height={768}
          />
        </div>
        <section
          className="my-4"
          dangerouslySetInnerHTML={{ __html: safeHTML }}
        />
      </div>
    </main>
  );
};

export default Page;
