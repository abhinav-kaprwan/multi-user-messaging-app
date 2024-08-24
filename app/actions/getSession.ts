import { auth } from "../libs/utils/authoptions";

export async function getSession() {
  return await auth();
}