import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Waitlist route is working.",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    return NextResponse.json({
      ok: true,
      message: "Waitlist submission received.",
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}