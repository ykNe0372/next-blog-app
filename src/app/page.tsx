"use client";

import { useState, useEffect } from "react";
import type { Post } from "@/app/_types/Post";
import PostSummary from "@/app/_components/PostSummary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons/faCaretUp";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
import { PostApiResponse } from "./_types/PostApiResponse";
import { useAuth } from "./_hooks/useAuth";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<Post[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [sortByCreatedAt, setSortByCreatedAt] = useState<boolean>(false);
  const [isDescending, setIsDescending] = useState<boolean>(true); // ソート順を管理する状態変数
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { session } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const requestUrl = `/api/posts`;
        const response = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const postResponse: PostApiResponse[] = await response.json();
        const posts = postResponse.map((rawPost) => ({
          id: rawPost.id,
          title: rawPost.title,
          content: rawPost.content,
          coverImageKey: rawPost.coverImageKey,
          createdAt: rawPost.createdAt,
          categories: rawPost.categories.map((category) => ({
            id: category.category.id,
            name: category.category.name,
          })),
        }));
        setPosts(posts);
        setFilteredPosts(posts);
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました"
        );
      }
    };
    fetchPosts();
  }, []);

  const handleSortByCreatedAt = () => {
    if (filteredPosts) {
      const sortedPosts = [...filteredPosts].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return isDescending ? dateB - dateA : dateA - dateB;
      });
      setFilteredPosts(sortedPosts);
      setSortByCreatedAt(true);
      setIsDescending(!isDescending); // ソート順を切り替える
    }
  };

  const handleSearch = () => {
    if (posts) {
      const query = searchQuery.toLowerCase();
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query)
      );
      setFilteredPosts(filtered);
    }
  };

  const handleReset = () => {
    setFilteredPosts(posts);
    setSearchQuery("");
  };

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  if (!filteredPosts) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <main>
      <div className="mb-2 text-2xl font-bold">投稿記事一覧</div>
      <div className="mt-4 flex items-center gap-x-2">
        <label htmlFor="search" className="font-bold">
          検索
        </label>
        <input
          type="text"
          id="search"
          placeholder="記事を検索します"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-md border border-gray-400 px-2 py-0.5"
        />
        <button
          type="button"
          onClick={handleSearch}
          className={twMerge(
            "my-2 rounded-md bg-blue-400 px-4 py-1 font-bold text-white hover:bg-blue-500"
          )}
        >
          検索
        </button>
        {searchQuery && (
          <button
            type="button"
            onClick={handleReset}
            className={twMerge(
              "my-2 rounded-md bg-red-400 px-4 py-1 font-bold text-white hover:bg-red-500"
            )}
          >
            リセット
          </button>
        )}
      </div>
      <div className="mb-4 flex items-center gap-x-2">
        <button
          type="button"
          onClick={handleSortByCreatedAt}
          className={twMerge(
            "my-2 rounded-md border border-slate-700 bg-gray-100 px-4 py-1 font-bold text-slate-700 hover:bg-gray-300"
          )}
        >
          <FontAwesomeIcon
            icon={isDescending ? faCaretDown : faCaretUp}
            className="mr-1"
          />
          投稿日時でソート
        </button>
      </div>
      <div className="mb-1 flex justify-end">
        {session ? (
          <Link href="/admin">
            <button
              type="button"
              className="mb-2 rounded-md bg-teal-400 px-3 py-1 text-white hover:bg-teal-500"
            >
              管理者ページへ
            </button>
          </Link>
        ) : (
          ""
        )}
      </div>
      <div className="space-y-3">
        {filteredPosts.map((post) => (
          <PostSummary
            key={sortByCreatedAt ? post.createdAt : post.id}
            post={post}
          />
        ))}
      </div>
    </main>
  );
};

export default Page;
