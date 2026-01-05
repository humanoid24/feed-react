/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDeviceId } from "@/lib/utils/device";

interface Feed {
  id: number;
  name: string;
  content: string;
  updatedAt: string;
}


export default function Home() {

  const [tampilFeed, setTampilFeed] = useState<Feed[]>([]);
  const [nameInput, setName] = useState<string>("");
  const [contentInput, setContent] = useState<string>("");
  const [idFeed, setIdFeed] = useState<number | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);


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

    await fetch("/api/feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameInput,
        content: contentInput,
        device_id: deviceId,
      }),
    });

    resetForm();

    const respon = await fetch("/api/feed");
    const hasil: Feed[] = await respon.json();
    setTampilFeed(hasil);
  };


  const updateFeed = async (): Promise<void> => {
    if (idFeed === null) return;

    await fetch("/api/feed", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: idFeed,
        name: nameInput,
        content: contentInput,
      }),
    });

    resetForm();

    const respon = await fetch("/api/feed");
    const hasil: Feed[] = await respon.json();
    setTampilFeed(hasil);
  };

  const deleteFeed = async (id: number): Promise<void> => {
    await fetch("/api/feed", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const respon = await fetch("/api/feed");
    const hasil: Feed[] = await respon.json();
    setTampilFeed(hasil);
  };


  const pilihEdit = (feed: Feed) => {
    setIdFeed(feed.id);
    setName(feed.name);
    setContent(feed.content);
  };


  const resetForm = () => {
    setIdFeed(null)
    setName("");
    setContent("");
  }





  return (
    <div>
      <div className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl text-black">
              Apa yang sedang kamu pikirkan?
            </h2>
            {/* INPUT STATUS */}
            {/* INPUT STATUS */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-full">
                    {/* INPUT NAMA */}
                    <input
                      type="text"
                      placeholder="Nama Samaran"
                      value={nameInput}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full mb-3 p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />

                    {/* TEXTAREA STATUS */}
                    <textarea
                      rows={3}
                      value={contentInput}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Apa yang sedang kamu pikirkan?"
                      className="w-full p-3 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />

                    <div className="flex justify-end mt-3">
                      <button
                        onClick={idFeed ? updateFeed : simpanFeed}
                        className="px-5 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                      >
                        {idFeed ? "Update" : "Posting"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tampilFeed.map((feeds) => (
              <div
                key={feeds.id}
                className="relative p-6 bg-white rounded-lg shadow-md transition-transform hover:shadow-lg hover:-translate-y-1"
              >
                <div className="absolute top-3 right-3 flex gap-2">
                  {/* EDIT */}
                  <button
                    onClick={() => pilihEdit(feeds)}
                    className="p-1 rounded hover:bg-blue-100 text-blue-600"
                    title="Edit"
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

                  {/* DELETE */}
                  <button
                    onClick={() => deleteFeed(feeds.id)}
                    className="p-1 rounded hover:bg-red-100 text-red-600"
                    title="Hapus"
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

                <Link href={`/feed/${feeds.id}`}>
                  <div className="flex items-start mb-4 gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold uppercase">
                      {feeds.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-black pt-2">{feeds.name}</h3>
                    </div>
                  </div>
                  <p className="text-gray-700">{feeds.content}</p>
                  <div className="flex items-center mt-4 text-gray-500">
                    {/* <svg
                  className="w-5 h-5 mr-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
                <span className="mr-4">143</span> */}

                    {/* <span className="text-sm">
                      {feeds.updatedAt?.slice(0, 10)}
                    </span> */}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
