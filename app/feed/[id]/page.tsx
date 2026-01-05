import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Detail({ params }: PageProps) {
  const { id } = await params;
  const feedId = Number(id);

  const supabase = await createClient();

  const { data: feedData, error } = await supabase
    .from("feed")
    .select("*")
    .eq("id", feedId)
    .single();

    if (error || !feedData) {
      return (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Feed tidak ditemukan
        </div>
      );
    }

  const userName = feedData.name;
  const userInitial = userName.charAt(0).toUpperCase();
  const feedContent = feedData.content;
  // const feedDate = new Date(feedData.updatedAt).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pt-16 pb-16">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border px-5 py-4">
        {/* HEADER */}
        <div className="flex items-start gap-3">
          {/* AVATAR */}
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {userInitial}
          </div>

          {/* NAME & TIME */}
          <div className="flex flex-col">
            <span className="font-semibold text-black">{userName}</span>
            {/* <span className="text-xs text-gray-500">{feedDate}</span> */}
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-3 text-[15px] leading-relaxed text-black">
          {feedContent}
        </div>
      </div>
    </div>
  );
}
