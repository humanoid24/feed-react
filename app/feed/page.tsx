/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { getDeviceId } from "@/lib/utils/device";
import FeedForm from "./component/FeedForm";
import FeedList from "./component/FeedList";
import DeleteModal from "./component/DeleteModal";
import LimitModal from "./component/LimitModal";


interface Feed {
  id: number;
  name: string;
  content: string;
  device_id: string;
  // updatedAt: string;
}

export default function Home() {
  const [tampilFeed, setTampilFeed] = useState<Feed[]>([]);
  const [nameInput, setName] = useState<string>("");
  const [contentInput, setContent] = useState<string>("");
  const [idFeed, setIdFeed] = useState<number | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");

  useEffect(() => {
    const ambilData = async () => {
      const ambil = await fetch("/api/feed");
      const hasil: Feed[] = await ambil.json();
      setTampilFeed(hasil);
    };

    ambilData();
  }, []);

  useEffect(() => {
    const id = getDeviceId();
    setDeviceId(id);
    console.log("DEVICE ID:", id);
  }, []);

  const simpanFeed = async (): Promise<void> => {
    if (!deviceId) {
      alert("Device ID belum siap");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameInput,
          content: contentInput,
          device_id: deviceId,
        }),
      });

      const data = await res.json();

      // 🚨 KENA LIMIT
      if (!res.ok) {
        setLimitMessage(data.error || "Limit posting tercapai");
        setShowLimitModal(true);
        return;
      }

      // ✅ Sukses
      resetForm();

      const respon = await fetch("/api/feed");
      const hasil: Feed[] = await respon.json();
      setTampilFeed(hasil);
    } finally {
      setLoading(false);
    }
  };

  const updateFeed = async (): Promise<void> => {
    if (idFeed === null) return;

    setLoading(true);

    try {
      await fetch("/api/feed", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: idFeed,
          name: nameInput,
          content: contentInput,
          device_id: deviceId,
        }),
      });

      resetForm();

      const respon = await fetch("/api/feed");
      const hasil: Feed[] = await respon.json();
      setTampilFeed(hasil);
    } finally {
      setLoading(false);
    }
  };

  const deleteFeed = async (id: number): Promise<void> => {
    await fetch("/api/feed", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, device_id: deviceId }),
    });

    const respon = await fetch("/api/feed");
    const hasil: Feed[] = await respon.json();
    setTampilFeed(hasil);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setLoading(true);
    try {
      await deleteFeed(deleteId);
      setDeleteId(null);
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };



  const pilihEdit = (feed: Feed) => {
    setIdFeed(feed.id);
    setName(feed.name);
    setContent(feed.content);
  };

  const resetForm = () => {
    setIdFeed(null);
    setName("");
    setContent("");
  };

  return (
    <div>
      <div className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl text-black">
              Apa yang lo pikirkan?
            </h2>
            {/* INPUT STATUS */}
            {/* INPUT STATUS */}
            <FeedForm
              nameInput={nameInput}
              setName={setName}
              contentInput={contentInput}
              setContent={setContent}
              idFeed={idFeed}
              updateFeed={updateFeed}
              simpanFeed={simpanFeed}
              loading={loading}
            />
          </div>

          <FeedList
            tampilFeed={tampilFeed}
            deviceId={deviceId}
            pilihEdit={pilihEdit}
            setDeleteId={setDeleteId}
            setShowDeleteModal={setShowDeleteModal}
          />
        </div>
      </div>
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={loading}
      />

      <LimitModal
        show={showLimitModal}
        message={limitMessage}
        onClose={() => setShowLimitModal(false)}
      />
    </div>
  );
}
