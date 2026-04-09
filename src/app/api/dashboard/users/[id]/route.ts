import { updateUserStatus, deleteUser } from "@/data-access-layer/admin/user-management";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as { is_banned?: boolean; is_admin?: boolean; verified?: boolean };
  const result = await updateUserStatus({ userId: id, updates: body });
  return NextResponse.json(result, { status: result.success ? 200 : 403 });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await deleteUser(id);
  return NextResponse.json(result, { status: result.success ? 200 : 403 });
}
