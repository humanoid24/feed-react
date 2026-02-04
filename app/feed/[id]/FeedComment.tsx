/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { getDeviceId } from "@/lib/utils/device";
import DeleteComment from "./DeleteComment";

interface Comment {
  id: number;
  feed_id: number;
  komentar: string;
  device_id: string;
  created_at: string;
}

export default function FeedComment({ feedId }: { feedId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [komentar, setKomentar] = useState("");
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);


  useEffect(() => {
    setDeviceId(getDeviceId());
    fetch(`/api/comment?feed_id=${feedId}`)
      .then((res) => res.json())
      .then(setComments);
  }, [feedId]);

  const submitComment = async () => {
    if (!deviceId || !komentar) return;

    await fetch("/api/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feed_id: feedId, komentar, device_id: deviceId }),
    });

    console.log({ feedId, komentar, deviceId });


    setKomentar("");
    const res = await fetch(`/api/comment?feed_id=${feedId}`);
    const data = await res.json();
    setComments(data ?? []);
  };

  const deleteComment = async (id: number) => {
    if (!deviceId) return;

    const res = await fetch("/api/comment", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        device_id: deviceId,
      }),
    });

    if (!res.ok) return;

    // langsung hapus dari state (biar responsif)
    setComments((prev) => prev.filter((c) => c.id !== id));
  };


  return (
    <div>
      {/* COMMENT SECTION */}
      <div className="mt-4 border-t pt-3">
        {/* LIST KOMENTAR */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                A
              </div>

              <div className="flex-1">
                <div className="relative bg-gray-100 rounded-xl px-3 py-2 text-sm">
                  {/* HEADER */}
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-semibold text-gray-800">Anonim</span>

                    {deviceId === c.device_id && (
                      <button
                        onClick={() => {
                          setDeleteId(c.id);
                          setShowDeleteModal(true);
                        }}
                        className="text-xs text-red-500 hover:text-red-700"
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
                    )}
                  </div>

                  {/* KOMENTAR */}
                  <p className="text-gray-700 leading-relaxed">{c.komentar}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="mt-4 flex gap-2 items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
            A
          </div>
          <input
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            placeholder="Tulis komentar..."
            className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm focus:outline-none text-black"
          />
          <button
            onClick={submitComment}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          >
            Kirim
          </button>
        </div>
      </div>
      <DeleteComment
        show={showDeleteModal}
        loading={loadingDelete}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteId(null);
        }}
        onConfirm={async () => {
          if (!deleteId) return;
          setLoadingDelete(true);
          await deleteComment(deleteId);
          setLoadingDelete(false);
          setShowDeleteModal(false);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
