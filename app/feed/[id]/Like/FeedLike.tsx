/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { getDeviceId } from "@/lib/utils/device";

type Props = {
  feedId: number;
};

export default function FeedActions({ feedId }: Props) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  
    useEffect(() => {
      setDeviceId(getDeviceId());
    }, []);

  useEffect(() => {
    if (!deviceId) return;

    const fetchLike = async () => {
      const res = await fetch(
        `/api/likes?feed_id=${feedId}&device_id=${deviceId}`,
         { cache: "no-store" }
      );
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    };

    fetchLike();
  }, [feedId, deviceId]);

  const toggleLike = async () => {
    if (!deviceId) return;


    const prevLiked = liked;
    const prevCount = likeCount;

    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);

    const res = await fetch("/api/likes", {
      method: liked ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feed_id: feedId, device_id: deviceId }),
    });

    if (!res.ok) {
      setLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };

  return (
    <div className="py-2 flex gap-10 text-sm pt-5">
      {/* LIKE */}
      <button
        onClick={toggleLike}
        disabled={!deviceId}
        className="flex items-center gap-1"
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
        <span className={liked ? "text-red-500" : "text-gray-500"}>
          {likeCount}
        </span>
      </button>

      {/* COMMENT */}
      <div className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition">
        <span className="text-xl">💬</span>
        <span className="text-sm">Komentar</span>
      </div>
    </div>
  );
}
