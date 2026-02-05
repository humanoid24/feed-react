import { NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server'

const MAX_POST_PER_DEVICE = 99;
const MAX_GLOBAL_POST = 200;

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("feed")
    .select("*")
    .order("id", { ascending: false });

if (error) {
  console.error("SUPABASE ERROR:", error);
  return NextResponse.json({ error: error.message }, { status: 500 });
}

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const deviceId = body.device_id;
  
  if (!deviceId) {
    return NextResponse.json(
      { error: "device_id wajib" },
      { status: 400 }
    );
  }


  // Cek post kalo 200 maka limit
  const { count: globalCount, error: globalError } = await supabase
    .from("feed")
    .select("*", { count: "exact", head: true });

  if (globalError) {
    return NextResponse.json({ error: globalError.message }, { status: 500 });
  }

  if ((globalCount ?? 0) >= MAX_GLOBAL_POST) {
    return NextResponse.json(
      { error: "Kuota global 200 posting sudah habis" },
      { status: 429 }
    );
  }

  // Cek Post kalo devicenya lebih dari 3
  const { count: deviceCount, error: deviceError } = await supabase
    .from("feed")
    .select("*", { count: "exact", head: true })
    .eq("device_id", deviceId);

  if (deviceError) {
    return NextResponse.json({ error: deviceError.message }, { status: 500 });
  }

  if ((deviceCount ?? 0) >= MAX_POST_PER_DEVICE) {
    return NextResponse.json(
      { error: "Limit 1 posting untuk device ini tercapai" },
      { status: 429 }
    );
  }

  // Insert Database
  const { data, error } = await supabase
  .from("feed")
  .insert({
    name: body.name,
    content: body.content,
    device_id: deviceId
  })
  .select()
  .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }


  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const supabase = await createClient();
  const bodyUpdate = await req.json();

  const { data, error } = await supabase
    .from("feed")
    .update({
      name: bodyUpdate.name,
      content: bodyUpdate.content,
    })
    .eq("id", bodyUpdate.id)
    .eq("device_id", bodyUpdate.device_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);


  
}

export async function DELETE(req: Request) {
  const supabase = await createClient();
  const bodyDelete = await req.json();

  const { data, error } = await supabase
    .from("feed")
    .delete()
    .eq("id", bodyDelete.id)
    .eq("device_id", bodyDelete.device_id)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);

}
