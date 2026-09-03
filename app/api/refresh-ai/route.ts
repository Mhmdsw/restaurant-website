import { NextResponse } from "next/server";

export async function POST() {
  try {
    const backendUrl = process.env.AI_BACKEND_URL;
    const refreshSecret = process.env.RAG_REFRESH_SECRET;

    if (!backendUrl || !refreshSecret) {
      return NextResponse.json(
        { error: "AI refresh configuration is missing" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${backendUrl}/refresh-knowledge`,
      {
        method: "POST",
        headers: {
          "x-refresh-secret": refreshSecret,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("AI refresh failed:", errorText);

      return NextResponse.json(
        { error: "AI refresh failed" },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("AI refresh error:", error);

    return NextResponse.json(
      { error: "Could not refresh AI" },
      { status: 500 }
    );
  }
}