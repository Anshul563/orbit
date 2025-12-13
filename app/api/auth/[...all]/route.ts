import { auth } from "@/lib/auth"; // Import the config we just made
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);