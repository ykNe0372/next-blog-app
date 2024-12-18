"use client";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

const syncTask = (name: string) => {
  console.log(`同期処理 ${name} が完了しました`);
};

const Page: React.FC = () => {
  const syncProcess = () => {
    console.log("関数 syncProcess を開始");
    syncTask("処理1");
    syncTask("処理2");
    syncTask("処理3");
    console.log("関数 syncProcess の最後に到達");
  };

  return (
    <main>
      <div className="mb-5 text-2xl font-bold">
        同期処理を理解するための実験1
      </div>
      <div className="space-y-3">
        <button
          onClick={syncProcess}
          className={twMerge(
            "rounded-md px-3 py-1",
            "bg-indigo-500 font-bold text-white hover:bg-indigo-600"
          )}
        >
          同期処理の実行
        </button>
        <div className="flex justify-items-start space-x-2">
          <div>
            <FontAwesomeIcon
              icon={faGear}
              className="animate-spin text-2xl [animation-duration:2s]"
            />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={1}>
              <input
                id={`cb-${i}`}
                type="checkbox"
                className="mr-1"
                defaultChecked={i === 1}
              />
              <label htmlFor={`cb-${i}`} className="font-bold">
                項目{i}
              </label>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Page;
