import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const feed_id = searchParams.get("feed_id");
  const device_id = searchParams.get("device_id");

  if (!feed_id) {
    return NextResponse.json({ error: "feed_id required" }, { status: 400 });
  }

  // jumlah like
  const { count } = await supabase
    .from("feed_likes")
    .select("*", { count: "exact", head: true })
    .eq("feed_id", feed_id);

  // status like per device
  let liked = false;
  if (device_id) {
    const { data } = await supabase
      .from("feed_likes")
      .select("id")
      .eq("feed_id", feed_id)
      .eq("device_id", device_id)
      .single();

    liked = !!data;
  }

  return NextResponse.json({
    likeCount: count || 0,
    liked,
  });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { feed_id, device_id } = await req.json();

  const { error } = await supabase
    .from("feed_likes")
    .insert({ feed_id, device_id }, );

  if (error) {
    console.error("SUPABASE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}



export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { feed_id, device_id } = await req.json();

  const { error } = await supabase
    .from("feed_likes")
    .delete()
    .eq("feed_id", feed_id)
    .eq("device_id", device_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

