import { NextResponse } from "next/server";
import { getJobsData } from "@/lib/jobs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getJobsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Get jobs error:", error);
    return NextResponse.json(
      { error: "Failed to load jobs" },
      { status: 500 }
    );
  }
}
