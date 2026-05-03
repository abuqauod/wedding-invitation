import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const guestsTable = pgTable("guests", {
  id: text("id").primaryKey(),
  primaryGuestId: text("primary_guest_id"),
  firstName: text("first_name").notNull(),
  familyName: text("family_name").notNull(),
  countryCode: text("country_code").notNull(),
  mobile: text("mobile").notNull(),
  fullPhone: text("full_phone").notNull().unique(),
  group: text("group_name").notNull(),
  lang: text("lang").notNull().default("en"),
  seatNumber: integer("seat_number"),
  tableNumber: integer("table_number"),
  registeredAt: timestamp("registered_at", { withTimezone: true }).notNull().defaultNow(),
  checkedInAt: timestamp("checked_in_at", { withTimezone: true }),
  whatsappSent: boolean("whatsapp_sent").notNull().default(false),
  whatsappSid: text("whatsapp_sid"),
  whatsappError: text("whatsapp_error"),
  companions: text("companions"),
});

export const insertGuestSchema = createInsertSchema(guestsTable).omit({
  registeredAt: true,
  checkedInAt: true,
  whatsappSent: true,
  whatsappSid: true,
  whatsappError: true,
  seatNumber: true,
  tableNumber: true,
});
export type InsertGuest = z.infer<typeof insertGuestSchema>;
export type Guest = typeof guestsTable.$inferSelect;
