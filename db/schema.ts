import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  uuid,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ----------------------------------------------------------------------
// 1. ENUMS
// ----------------------------------------------------------------------
export const roleEnum = pgEnum("role", ["student", "admin"]);
export const swapStatusEnum = pgEnum("swap_status", [
  "pending",
  "active",
  "completed",
  "disputed",
  "cancelled",
]);
export const transactionTypeEnum = pgEnum("transaction_type", [
  "deposit",
  "withdrawal",
  "payment",
  "escrow_lock",
  "escrow_release",
  "system_reward",
]);

// ----------------------------------------------------------------------
// 2. AUTHENTICATION (Renamed to Singular for Better-Auth)
// ----------------------------------------------------------------------
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  coverImage: text("cover_image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),

  // -- ORBIT SPECIFIC FIELDS --
  university: text("university"),
  bio: text("bio"),
  credits: integer("credits").default(100).notNull(),
  skillsOffered: text("skills_offered").array(),
  skillsWanted: text("skills_wanted").array(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(), // <--- ADDED THIS (Required)
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"), // <--- THE FIX
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"), // Recommended
  scope: text("scope"), // Recommended
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"), // <--- ADDED THIS
  updatedAt: timestamp("updated_at"),
});

// ----------------------------------------------------------------------
// 3. MARKETPLACE
// ----------------------------------------------------------------------

export const post = pgTable("post", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: text("author_id")
    .references(() => user.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "request" or "offer"
  budget: integer("budget").notNull(),
  tags: text("tags").array(),
  status: text("status").default("open"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const swap = pgTable("swap", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id").references(() => post.id),
  requesterId: text("requester_id")
    .references(() => user.id)
    .notNull(),
  providerId: text("provider_id")
    .references(() => user.id)
    .notNull(),
  price: integer("price").notNull(),
  status: swapStatusEnum("status").default("pending"),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// ----------------------------------------------------------------------
// 4. ECONOMY
// ----------------------------------------------------------------------
export const transaction = pgTable("transaction", {
  id: uuid("id").defaultRandom().primaryKey(),
  senderId: text("sender_id").references(() => user.id),
  receiverId: text("receiver_id").references(() => user.id),
  amount: integer("amount").notNull(),
  type: transactionTypeEnum("type").notNull(),
  referenceId: text("reference_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ----------------------------------------------------------------------
// 5. CHAT
// ----------------------------------------------------------------------
export const message = pgTable("message", {
  id: uuid("id").defaultRandom().primaryKey(),
  swapId: uuid("swap_id")
    .references(() => swap.id)
    .notNull(),
  senderId: text("sender_id")
    .references(() => user.id)
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  posts: many(post),
  swapsAsRequester: many(swap, { relationName: "requester" }),
  swapsAsProvider: many(swap, { relationName: "provider" }),
  messages: many(message),
}));

export const postRelations = relations(post, ({ one, many }) => ({
  author: one(user, {
    fields: [post.authorId],
    references: [user.id],
  }),
  swaps: many(swap),
}));

export const swapRelations = relations(swap, ({ one, many }) => ({
  post: one(post, {
    fields: [swap.postId],
    references: [post.id],
  }),
  requester: one(user, {
    fields: [swap.requesterId],
    references: [user.id],
    relationName: "requester",
  }),
  provider: one(user, {
    fields: [swap.providerId],
    references: [user.id],
    relationName: "provider",
  }),
  messages: many(message),
}));

export const messageRelations = relations(message, ({ one }) => ({
  swap: one(swap, {
    fields: [message.swapId],
    references: [swap.id],
  }),
  sender: one(user, {
    fields: [message.senderId],
    references: [user.id],
  }),
}));

// ... existing imports
// ... existing tables (user, post, swap, etc.)

// ----------------------------------------------------------------------
// 7. COMMUNITIES (Add these new tables)
// ----------------------------------------------------------------------
export const community = pgTable("community", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  ownerId: text("owner_id")
    .references(() => user.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  color: text("color").default("bg-blue-600"),
  isPrivate: boolean("is_private").default(false), // true = hidden from search
  image: text("image"),
  coverImage: text("cover_image"), // NEW: Cover Image (16:9)
  inviteCode: text("invite_code").unique(), // For sharing links (e.g., /join/abc-123)
});

export const communityMember = pgTable("community_member", {
  id: uuid("id").defaultRandom().primaryKey(),
  communityId: uuid("community_id")
    .references(() => community.id)
    .notNull(),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
  role: text("role").default("member"),
});

export const communityMessage = pgTable("community_message", {
  id: uuid("id").defaultRandom().primaryKey(),
  communityId: uuid("community_id")
    .references(() => community.id)
    .notNull(),
  senderId: text("sender_id")
    .references(() => user.id)
    .notNull(),
  content: text("content").notNull(),
  attachmentUrl: text("attachment_url"), // <--- New Column
  attachmentType: text("attachment_type"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ----------------------------------------------------------------------
// UPDATED RELATIONS (Append these to your existing relations section)
// ----------------------------------------------------------------------

export const communityRelations = relations(community, ({ one, many }) => ({
  owner: one(user, {
    fields: [community.ownerId],
    references: [user.id],
  }),
  members: many(communityMember),
}));

export const communityMessageRelations = relations(
  communityMessage,
  ({ one }) => ({
    community: one(community, {
      fields: [communityMessage.communityId],
      references: [community.id],
    }),
    sender: one(user, {
      fields: [communityMessage.senderId],
      references: [user.id],
    }),
  })
);

export const communityMemberRelations = relations(
  communityMember,
  ({ one }) => ({
    community: one(community, {
      fields: [communityMember.communityId],
      references: [community.id],
    }),
    user: one(user, {
      fields: [communityMember.userId],
      references: [user.id],
    }),
  })
);

// ----------------------------------------------------------------------
// 9. STUDY SESSIONS (New Tables)
// ----------------------------------------------------------------------

export const studySession = pgTable("study_session", {
  id: uuid("id").defaultRandom().primaryKey(),
  hostId: text("host_id")
    .references(() => user.id)
    .notNull(),
  topic: text("topic").notNull(),
  scheduledAt: timestamp("scheduled_at").defaultNow(), // If null, it's instant
  createdAt: timestamp("created_at").defaultNow(),
});

export const studyInvite = pgTable("study_invite", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => studySession.id)
    .notNull(),
  email: text("email").notNull(),
  status: text("status").default("pending"), // pending, accepted
});

// ----------------------------------------------------------------------
// UPDATED RELATIONS
// ----------------------------------------------------------------------

export const studySessionRelations = relations(
  studySession,
  ({ one, many }) => ({
    host: one(user, {
      fields: [studySession.hostId],
      references: [user.id],
    }),
    invites: many(studyInvite),
  })
);

export const studyInviteRelations = relations(studyInvite, ({ one }) => ({
  session: one(studySession, {
    fields: [studyInvite.sessionId],
    references: [studySession.id],
  }),
}));

export const transactionRelations = relations(transaction, ({ one }) => ({
  sender: one(user, {
    fields: [transaction.senderId],
    references: [user.id],
    relationName: "sender",
  }),
  receiver: one(user, {
    fields: [transaction.receiverId],
    references: [user.id],
    relationName: "receiver",
  }),
}));

export const notification = pgTable("notification", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  title: text("title").notNull(),
  message: text("message"),
  type: text("type").default("info"), // info, message, credit, system
  link: text("link"), // Optional URL to redirect to
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Track every swipe action
export const swipe = pgTable("swipe", {
  swiperId: text("swiper_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  targetId: text("target_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  action: text("action", { enum: ["like", "pass"] }).notNull(), // 'like' or 'pass'
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.swiperId, t.targetId] }), // Prevent duplicate swipes
}));

// Track successful matches
export const match = pgTable("match", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  user1Id: text("user1_id").notNull().references(() => user.id),
  user2Id: text("user2_id").notNull().references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
});