import { NextResponse, NextRequest } from "next/server";
import { updateEnrollment } from "@/app/utils/updateEnrollment";
import { deleteEnrollment } from "@/app/utils/removeEnrollment";

export async function PUT(request: NextRequest) {
  const updateData = await request.json();

  if (!updateData.courseId || !updateData.userId || !updateData.siteId) {
    return NextResponse.json({
      status: 400,
      message: "Course ID, User ID, and Site ID are required",
    });
  }

  const result = await updateEnrollment(updateData);
  return NextResponse.json(result, { status: result.status });
}

export async function DELETE(request: NextRequest) {
  const removeData = await request.json();

  if (!removeData.courseId || !removeData.userId || !removeData.siteId) {
    return NextResponse.json({
      status: 400,
      message: "Course ID, User ID, and Site ID are required",
    });
  }

  const result = await deleteEnrollment(removeData);
  return NextResponse.json(result, { status: result.status });
}
