import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { updateWhatsAppNumber, addCategory, deleteCategory, updateGitHubSettings } from "@/lib/jobs";

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (body.whatsappNumber !== undefined) {
      const settings = await updateWhatsAppNumber(body.whatsappNumber);
      return NextResponse.json(settings);
    }

    if (body.action === "addCategory" && body.name) {
      const categories = await addCategory(body.name);
      return NextResponse.json({ categories });
    }

    if (body.action === "deleteCategory" && body.name) {
      const deleted = await deleteCategory(body.name);
      return NextResponse.json({ deleted });
    }

    if (body.action === "updateGithub" && body.github) {
      const settings = await updateGitHubSettings(body.github);
      return NextResponse.json(settings);
    }

    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
