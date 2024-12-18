"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const Page: React.FC = () => {
  const endpoint = "https://zipcloud.ibsnet.co.jp/api/search";
  const { code } = useParams() as { code: string };
  const [response, setResponse] = useState<string>("API からデータを取得中...");

  useEffect(() => {
    const fetchAddressFromZipcode = async () => {
      const requestUrl = `${endpoint}?zipcode=${code}`; // API に GET リクエストを送信してレスポンスを取得
      const response = await fetch(requestUrl, {
        method: "GET",
        cache: "no-store", // キャッシュを利用しない
      });
      console.log("ウェブ API からデータを取得しました");

      // レスポンスから JSON 形式でデータを取得➡整形して表示
      const parsedData = await response.json();
      setResponse(JSON.stringify(parsedData, null, 2));
    };

    fetchAddressFromZipcode(); // 関数実行
  }, [code]);

  return (
    <main>
      <div className="mb-5 text-2xl font-bold">{`郵便番号 ${code} の検索`}</div>
      <div className="space-y-3">
        <div>実行結果</div>
        <pre className="rounded-md bg-green-100 p-3 text-sm">{response}</pre>
      </div>
    </main>
  );
};

export default Page;
