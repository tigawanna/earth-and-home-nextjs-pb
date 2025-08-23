import { cookies } from "next/headers";
import { RecordModel } from "pocketbase";
const auth_cookie_key = "pb_auth";

export async function storeCookie(token: string, model: RecordModel) {
  const cookieString = JSON.stringify({
    token,
    model,
  });
  const cookie = await cookies();
  cookie.set(auth_cookie_key, cookieString, {
    secure: true,
    path: "/",
    sameSite: "strict",
    httpOnly: true,
  });
}

export async function deleteCookie() {
  const cookie = await cookies();
  cookie.delete(auth_cookie_key);
}
