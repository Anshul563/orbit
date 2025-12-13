import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // Your database connection
import * as schema from "@/db/schema"; // Your schema with the 'users' table

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // We are using PostgreSQL (Neon)
    schema: schema, // Pass your schema so it knows table names
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  // This ensures the 100 Credits (defined in your schema default) are respected
  user: {
    additionalFields: {
      credits: {
        type: "number",
        required: false,
        defaultValue: 100,
        input: false, // User cannot edit this themselves
      },
      university: {
        type: "string",
        required: false,
      }
    }
  }
});