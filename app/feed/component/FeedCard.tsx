import { useEffect, useState } from "react";
import Link from "next/link";

export type Feed = {
  id: number;
  name: string;
  content: string;
  device_id: string;
  updatedAt?: string;
};

type FeedCardProps = {
  feeds: Feed;
  deviceId: string | null;
  pilihEdit: (feed: Feed) => void;
  setDeleteId: (id: number) => void;
  setShowDeleteModal: (show: boolean) => void;
};

export default function FeedCard({
  feeds,
  deviceId,
  pilihEdit,
  setDeleteId,
  setShowDeleteModal,
}: FeedCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (!deviceId) return;

    const fetchLike = async () => {
      const res = await fetch(
        `/api/likes?feed_id=${feeds.id}&device_id=${deviceId}`,
         { cache: "no-store" }
      );
      const data = await res.json();

      setLiked(data.liked);
      setLikeCount(data.likeCount);
    };

    fetchLike();
  }, [feeds.id, deviceId]);

  const toggleLike = async () => {
    if (!deviceId) return;

    const prevLiked = liked;
    const prevCount = likeCount;

    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);

    const method = liked ? "DELETE" : "POST";

    const res = await fetch("/api/likes", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feed_id: feeds.id,
        device_id: deviceId,
      }),
    });

    if (!res.ok) {
      setLiked(prevLiked);
      setLikeCount(prevCount);
    }

  };
    const truncateWords = (text: string, maxWords: number) => {
      const words = text.trim().split(/\s+/);
      if (words.length <= maxWords) return text;
      return words.slice(0, maxWords).join(" ") + " ...";
    };

  return (
    <div className="relative p-6 bg-white rounded-lg shadow-md hover:-translate-y-1 transition">
      {deviceId === feeds.device_id && (
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => pilihEdit(feeds)}
            className="p-1 rounded hover:bg-blue-100 text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2.5 2.5 0 013.536 3.536L12.536 14.536a2.5 2.5 0 01-1.768.732H9v-1.768a2.5 2.5 0 01.732-1.768z"
              />
            </svg>
          </button>

          <button
            onClick={() => {
              setDeleteId(feeds.id);
              setShowDeleteModal(true);
            }}
            className="p-1 rounded hover:bg-red-100 text-red-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
              />
            </svg>
          </button>
        </div>
      )}

      <Link href={`/feed/${feeds.id}`}>
        <div className="flex gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
            {feeds.name.charAt(0)}
          </div>
          <h3 className="font-bold text-black">{feeds.name}</h3>
        </div>

        <p className="text-gray-700">{truncateWords(feeds.content, 32)}</p>
      </Link>

      <button
        onClick={toggleLike}
        className="mt-3 flex items-center gap-1 text-sm text-black"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 ${
            liked ? "text-red-500 fill-red-500" : "text-red-500 fill-white"
          }`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>

        <span>{likeCount}</span>
      </button>
    </div>
  );
}
