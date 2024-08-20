import { 
    pgTable,
    varchar,
    text,
    timestamp,
    uuid,
    primaryKey,
    integer,
    boolean,
    uniqueIndex
 } from "drizzle-orm/pg-core";

 import { relations } from "drizzle-orm";

    export const users = pgTable('users', {
        id: uuid('id').primaryKey().defaultRandom(),
        name: varchar('name', { length: 255 }),
        email: varchar('email', { length: 255 }).unique(),
        emailVerified: timestamp('email_verified', { mode: 'date' }),
        image: text('image'),
        hashedPassword: text('hashed_password'),
        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp('updated_at'),
        status: varchar('status', { length: 50 }),
        isTyping: boolean('is_typing').default(false),
    });

    export const accounts = pgTable('accounts', {
        id: uuid('id').primaryKey().defaultRandom(),
        userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
        type: varchar('type', { length: 255 }).notNull(),
        provider: varchar('provider', { length: 255 }).notNull(),
        providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
        refreshToken: text('refresh_token'),
        accessToken: text('access_token'),
        expiresAt: integer('expires_at'),
        tokenType: varchar('token_type', { length: 255 }),
        scope: text('scope'),
        idToken: text('id_token'),
        sessionState: text('session_state'),
    }, (table) => ({
        providerProviderAccountIdIdx: uniqueIndex('provider_provider_account_id_idx').on(
            table.provider,
            table.providerAccountId
        ),
    }));

    // export const conversations = pgTable('conversations', {
    //     id: uuid('id').primaryKey().defaultRandom(),
    //     createdAt: timestamp('created_at').defaultNow(),
    //     lastMessageAt: timestamp('last_message_at').defaultNow(),
    //     name: text('name'),
    //     isGroup: boolean('is_group'),
    // });

    // export const messages = pgTable('messages', {
    //     id: uuid('id').primaryKey().defaultRandom(),
    //     body: text('body'),
    //     image: text('image'),
    //     createdAt: timestamp('created_at').defaultNow(),
    //     conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
    //     senderId: uuid('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    // });

    // export const userConversations = pgTable('user_conversations', {
    //     userId: uuid('user_id').notNull().references(() => users.id),
    //     conversationId: uuid('conversation_id').notNull().references(() => conversations.id),
    // }, (table) => ({
    //     pk: primaryKey({columns:[table.userId, table.conversationId]}),
    // }));

    // export const userSeenMessages = pgTable('user_seen_messages', {
    //     userId: uuid('user_id').notNull().references(() => users.id),
    //     messageId: uuid('message_id').notNull().references(() => messages.id),
    // }, (table) => ({
    //     primaryKey: primaryKey({columns:[table.userId, table.messageId]}),
    // }));

    export const userRelations = relations(users, ({ many }) => ({
        accounts: many(accounts),
        // conversations: many(userConversations),
        // messages: many(messages),
        // seenMessages: many(userSeenMessages),
        // sentMessages: many(messages, { relationName: 'sender' }),
    }));

    export const accountRelations = relations(accounts, ({ one }) => ({
        user: one(users, {
            fields: [accounts.userId],
            references: [users.id],
        }),
    }));
    
    // export const conversationRelations = relations(conversations, ({ many }) => ({
    //     messages: many(messages),
    //     users: many(userConversations),
    // }));

    // export const messageRelations = relations(messages, ({ one, many }) => ({
    //     conversation: one(conversations, {
    //         fields: [messages.conversationId],
    //         references: [conversations.id],
    //     }),
    //     sender: one(users, {
    //         fields: [messages.senderId],
    //         references: [users.id],
    //     }),
    //     seenBy: many(userSeenMessages),
    // }));