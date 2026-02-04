import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const feed_id = searchParams.get("feed_id");

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("feed_comments")
      .select("*")
      .eq("feed_id", feed_id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const body = await req.json();
  console.log("BODY:", body);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("feed_comments")
    .insert({
      feed_id: body.feed_id,
      komentar: body.komentar,
      device_id: body.device_id,
    })
    .select()
    .single();

 if (error) {
   console.error("SUPABASE ERROR:", error);
   return NextResponse.json(
     { error: error.message, details: error },
     { status: 500 },
   );
 }

  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const { id, device_id } = await req.json();

  const supabase = await createClient();

  const { error } = await supabase
    .from("feed_comments")
    .delete()
    .eq("id", id)
    .eq("device_id", device_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

