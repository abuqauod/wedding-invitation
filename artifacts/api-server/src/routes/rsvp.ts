import { Router, type IRouter } from "express";
import path from "node:path";
import fs from "node:fs/promises";
import QRCode from "qrcode";
import sharp from "sharp";
import { db, guestsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const QR_DIR = path.resolve(process.cwd(), "qr-codes");
fs.mkdir(QR_DIR, { recursive: true }).catch(() => {});

const ASSETS_DIR = path.resolve(process.cwd(), "assets");

// New invitation images — one per language
const INVITATION_AR = path.join(ASSETS_DIR, "invitation_ar.jpeg"); // Arabic text version
const INVITATION_EN = path.join(ASSETS_DIR, "invitation_en.jpeg"); // English text version
// Fallback
const INVITATION_FALLBACK = path.join(ASSETS_DIR, "invitation.jpeg");

// QR overlay position on the new 1119×1600 invitation images
// The placeholder QR in the cards is centred at ~y=1230, size ~260px
const QR_SIZE = 260;
const QR_LEFT = Math.round((1119 - QR_SIZE) / 2); // 430
const QR_TOP = 1100;

async function buildPersonalizedInvitation(opts: {
  id: string;
  firstName: string;
  familyName: string;
  lang?: string;
}): Promise<Buffer> {
  const langKey = opts.lang === "ar" ? "ar" : "en";
  const invPath = langKey === "ar" ? INVITATION_AR : INVITATION_EN;

  // Fallback to original if new images not found
  const resolvedPath = await fs.access(invPath).then(() => invPath).catch(() => INVITATION_FALLBACK);
  const invitation = sharp(resolvedPath);

  const qrPng = await QRCode.toBuffer(String(opts.id), {
    width: QR_SIZE,
    margin: 1,
    color: { dark: "#c9a000", light: "#ffffff00" }, // gold QR, transparent bg to blend
    type: "png",
  });

  const composed = await invitation
    .composite([{ input: qrPng, top: QR_TOP, left: QR_LEFT, blend: "over" }])
    .jpeg({ quality: 90 })
    .toBuffer();

  return composed;
}

const TWILIO_SID = process.env["TWILIO_ACCOUNT_SID"];
const TWILIO_TOKEN = process.env["TWILIO_AUTH_TOKEN"];
const TWILIO_FROM = process.env["TWILIO_WHATSAPP_FROM"];
const ensureWa = (n: string) => (n.startsWith("whatsapp:") ? n : `whatsapp:${n}`);

if (TWILIO_FROM) {
  const masked = TWILIO_FROM.length > 6 ? TWILIO_FROM.slice(0, 4) + "***" + TWILIO_FROM.slice(-3) : "***";
  logger.info({ from: ensureWa(TWILIO_FROM.trim()), masked }, "Twilio WhatsApp From configured");
} else {
  logger.warn("TWILIO_WHATSAPP_FROM is not set");
}

function publicBaseUrl(req: any): string {
  const envDomain = process.env["REPLIT_DEV_DOMAIN"];
  if (envDomain) return `https://${envDomain}`;
  const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol || "https";
  const host = (req.headers["x-forwarded-host"] as string) || req.get("host");
  return `${proto}://${host}`;
}

function buildMessage(firstName: string, lang: string): string {
  if (lang === "ar") {
    return [
      `أهلاً ${firstName}،`,
      ``,
      `شكراً جزيلاً لتأكيد حضوركم حفل زفاف مجد ودانا 💐`,
      ``,
      `📅 التاريخ: 1 / 7 / 2026`,
      `🕖 الوقت: السابعة والربع مساءً`,
      `📍 المكان: فندق ريتز كارلتون - عمّان، الأردن`,
      ``,
      `هذه بطاقة الدخول الخاصة بكم. الرجاء إبرازها عند المدخل.`,
      ``,
      `بانتظار تشريفكم،`,
      `عائلتا أبو شامية (آل نوفل) وزيدان (آل الثبتة)`,
    ].join("\n");
  }
  return [
    `Dear ${firstName},`,
    ``,
    `Thank you for confirming your attendance at the wedding of Majd & Dana 💐`,
    ``,
    `📅 Date: 1 July 2026`,
    `🕖 Time: 7:15 PM`,
    `📍 Venue: The Ritz-Carlton, Amman — Jordan`,
    ``,
    `This is your personal entry pass. Please present it at the entrance.`,
    ``,
    `Warm regards,`,
    `The Abu-Shamiyeh (Al Nofal) & Zeidan (Al Thabatah) Families`,
  ].join("\n");
}

async function sendWhatsApp(opts: {
  to: string;
  firstName: string;
  lang: string;
  mediaUrl: string;
}): Promise<{ ok: boolean; sid?: string; error?: string; code?: number }> {
  if (!TWILIO_SID || !TWILIO_TOKEN || !TWILIO_FROM) {
    return { ok: false, error: "twilio_not_configured" };
  }
  const toNumber = ensureWa(opts.to);
  const fromNumber = ensureWa(String(TWILIO_FROM).trim());
  const message = buildMessage(opts.firstName, opts.lang);

  const params = new URLSearchParams();
  params.append("From", fromNumber);
  params.append("To", toNumber);
  params.append("Body", message);
  params.append("MediaUrl", opts.mediaUrl);

  const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64");
  const twResp = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
    {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    },
  );
  const twJson: any = await twResp.json();
  if (!twResp.ok) {
    logger.error({ status: twResp.status, twJson }, "Twilio send failed");
    return { ok: false, error: twJson?.message || "twilio_error", code: twJson?.code };
  }
  logger.info({ sid: twJson?.sid, to: toNumber }, "WhatsApp message sent");
  return { ok: true, sid: twJson?.sid };
}

// POST /api/rsvp — register guest and build invitation image (no auto-send)
router.post("/rsvp", async (req, res) => {
  try {
    const { id, firstName, familyName, fullPhone, lang, group, countryCode, mobile, companions } = req.body || {};
    if (!id || !firstName || !familyName || !fullPhone) {
      return res.status(400).json({ ok: false, error: "missing_fields" });
    }

    const existing = await db
      .select()
      .from(guestsTable)
      .where(eq(guestsTable.fullPhone, String(fullPhone)))
      .limit(1);
    if (existing.length > 0) {
      return res.status(409).json({ ok: false, error: "duplicate_phone", guest: existing[0] });
    }

    const companionsStr = companions && Array.isArray(companions) ? JSON.stringify(companions) : null;

    await db.insert(guestsTable).values({
      id: String(id),
      firstName: String(firstName),
      familyName: String(familyName),
      countryCode: String(countryCode || ""),
      mobile: String(mobile || ""),
      fullPhone: String(fullPhone),
      group: String(group || ""),
      lang: lang === "ar" ? "ar" : "en",
      companions: companionsStr,
    });

    // Build & cache the personalized invitation image with QR overlay
    const composed = await buildPersonalizedInvitation({
      id: String(id),
      firstName: String(firstName),
      familyName: String(familyName),
      lang: lang === "ar" ? "ar" : "en",
    });
    const outPath = path.join(QR_DIR, `${id}.jpg`);
    await fs.writeFile(outPath, composed);

    return res.json({ ok: true, id: String(id) });
  } catch (err: any) {
    logger.error({ err }, "RSVP route error");
    return res.status(500).json({ ok: false, error: err?.message || "server_error" });
  }
});

// GET /api/guests — admin list of all RSVPs
router.get("/guests", async (_req, res) => {
  try {
    const rows = await db.select().from(guestsTable).orderBy(guestsTable.registeredAt);
    return res.json({ ok: true, guests: rows, count: rows.length });
  } catch (err: any) {
    logger.error({ err }, "list guests failed");
    return res.status(500).json({ ok: false, error: err?.message || "server_error" });
  }
});

// POST /api/guests/:id/resend — manually send (or resend) the WhatsApp entry pass
router.post("/guests/:id/resend", async (req, res) => {
  try {
    const id = req.params.id;
    const found = await db.select().from(guestsTable).where(eq(guestsTable.id, id)).limit(1);
    if (found.length === 0) return res.status(404).json({ ok: false, error: "guest_not_found" });
    const guest = found[0]!;

    // Ensure image exists (rebuild if needed)
    const outPath = path.join(QR_DIR, `${id}.jpg`);
    try { await fs.access(outPath); } catch {
      const composed = await buildPersonalizedInvitation({ id, firstName: guest.firstName, familyName: guest.familyName, lang: guest.lang });
      await fs.writeFile(outPath, composed);
    }

    const mediaUrl = `${publicBaseUrl(req)}/api/qr/${id}.jpg`;
    const result = await sendWhatsApp({ to: guest.fullPhone, firstName: guest.firstName, lang: guest.lang, mediaUrl });

    if (result.ok) {
      await db.update(guestsTable).set({ whatsappSent: true, whatsappSid: result.sid || "", whatsappError: null }).where(eq(guestsTable.id, id));
      return res.json({ ok: true, sent: true, sid: result.sid });
    } else {
      await db.update(guestsTable).set({ whatsappSent: false, whatsappError: result.error || "send_failed" }).where(eq(guestsTable.id, id));
      return res.status(502).json({ ok: false, sent: false, error: result.error, code: result.code });
    }
  } catch (err: any) {
    logger.error({ err }, "resend WhatsApp failed");
    return res.status(500).json({ ok: false, error: err?.message || "server_error" });
  }
});

// PATCH /api/guests/:id/seat — assign a table and seat
router.patch("/guests/:id/seat", async (req, res) => {
  try {
    const id = req.params.id;
    const { tableNumber, seatNumber } = req.body || {};
    if (!id) return res.status(400).json({ ok: false, error: "missing_id" });
    const updated = await db
      .update(guestsTable)
      .set({
        tableNumber: tableNumber !== undefined ? Number(tableNumber) : null,
        seatNumber: seatNumber !== undefined ? Number(seatNumber) : null,
      })
      .where(eq(guestsTable.id, id))
      .returning();
    if (updated.length === 0) return res.status(404).json({ ok: false, error: "guest_not_found" });
    return res.json({ ok: true, guest: updated[0] });
  } catch (err: any) {
    logger.error({ err }, "assign seat failed");
    return res.status(500).json({ ok: false, error: err?.message || "server_error" });
  }
});

// GET /api/qr/:id.jpg — serve a guest's personalized invitation image
router.get("/qr/:filename", async (req, res) => {
  try {
    const filePath = path.join(QR_DIR, req.params.filename);
    const buf = await fs.readFile(filePath);
    res.set("Content-Type", "image/jpeg");
    res.set("Cache-Control", "public, max-age=86400");
    return res.send(buf);
  } catch {
    return res.status(404).json({ ok: false, error: "not_found" });
  }
});

// GET /api/assets/invitation — serves the plain wedding invitation card image
router.get("/assets/invitation", async (_req, res) => {
  try {
    // serve the Arabic version as the default (most guests)
    const p = await fs.access(INVITATION_AR).then(() => INVITATION_AR).catch(() => INVITATION_FALLBACK);
    const buf = await fs.readFile(p);
    res.set("Content-Type", "image/jpeg");
    res.set("Cache-Control", "public, max-age=86400");
    return res.send(buf);
  } catch {
    return res.status(404).json({ ok: false, error: "invitation_not_found" });
  }
});

// GET /api/assets/invitation/:lang — language-specific invitation card
router.get("/assets/invitation/:lang", async (req, res) => {
  try {
    const lang = req.params.lang === "en" ? "en" : "ar";
    const p = lang === "en"
      ? await fs.access(INVITATION_EN).then(() => INVITATION_EN).catch(() => INVITATION_FALLBACK)
      : await fs.access(INVITATION_AR).then(() => INVITATION_AR).catch(() => INVITATION_FALLBACK);
    const buf = await fs.readFile(p);
    res.set("Content-Type", "image/jpeg");
    res.set("Cache-Control", "public, max-age=86400");
    return res.send(buf);
  } catch {
    return res.status(404).json({ ok: false, error: "invitation_not_found" });
  }
});

function buildInviteMessage(lang: string, registrationUrl: string): string {
  if (lang === "ar") {
    return [
      `السلام عليكم،`,
      ``,
      `يسعد عائلتا أبو شامية (آل نوفل) وزيدان (آل الثبتة)`,
      `دعوتكم لحضور حفل زفاف`,
      ``,
      `✨ مجد ودانا ✨`,
      ``,
      `📅 الأربعاء 1 / 7 / 2026`,
      `🕖 السابعة والربع مساءً`,
      `📍 فندق ريتز كارلتون - عمّان، الأردن`,
      ``,
      `الرجاء تأكيد الحضور عبر الرابط التالي:`,
      registrationUrl,
      ``,
      `نتشوق لتشريفكم 💐`,
    ].join("\n");
  }
  return [
    `Peace be upon you,`,
    ``,
    `The Abu-Shamiyeh (Al Nofal) & Zeidan (Al Thabatah) families`,
    `joyfully invite you to celebrate the marriage of`,
    ``,
    `✨ Majd & Dana ✨`,
    ``,
    `📅 Wednesday, 1 July 2026`,
    `🕖 7:15 PM`,
    `📍 The Ritz-Carlton, Amman — Jordan`,
    ``,
    `Please confirm your attendance:`,
    registrationUrl,
    ``,
    `We look forward to celebrating with you 💐`,
  ].join("\n");
}

// POST /api/invite — send general WhatsApp invitations (plain card + registration link)
router.post("/invite", async (req, res) => {
  const { phones, lang } = req.body || {};
  if (!Array.isArray(phones) || phones.length === 0) {
    return res.status(400).json({ ok: false, error: "phones_required" });
  }
  if (!TWILIO_SID || !TWILIO_TOKEN || !TWILIO_FROM) {
    return res.status(503).json({ ok: false, error: "whatsapp_not_configured" });
  }

  const registrationUrl = `https://${process.env["REPLIT_DEV_DOMAIN"] || "your-site.replit.app"}/`;
  const mediaUrl = `https://${process.env["REPLIT_DEV_DOMAIN"] || "your-site.replit.app"}/api/assets/invitation/${lang === "ar" ? "ar" : "en"}`;
  const message = buildInviteMessage(lang === "ar" ? "ar" : "en", registrationUrl);

  const fromNumber = ensureWa(String(TWILIO_FROM).trim());
  const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64");

  const results: { phone: string; ok: boolean; sid?: string; error?: string }[] = [];

  for (const rawPhone of phones as string[]) {
    const phone = rawPhone.trim();
    if (!phone) continue;
    try {
      const params = new URLSearchParams();
      params.append("From", fromNumber);
      params.append("To", ensureWa(phone));
      params.append("Body", message);
      params.append("MediaUrl", mediaUrl);

      const twResp = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
        {
          method: "POST",
          headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        },
      );
      const twJson: any = await twResp.json();
      if (twResp.ok) {
        results.push({ phone, ok: true, sid: twJson?.sid });
        logger.info({ sid: twJson?.sid, to: phone }, "General invite sent");
      } else {
        results.push({ phone, ok: false, error: twJson?.message || "twilio_error" });
        logger.error({ phone, twJson }, "General invite failed");
      }
    } catch (err: any) {
      results.push({ phone, ok: false, error: err?.message || "send_error" });
    }
  }

  return res.json({ ok: true, results });
});

// POST /api/guests/:id/checkin — mark a guest as checked in
router.post("/guests/:id/checkin", async (req, res) => {
  try {
    const id = req.params.id;
    const found = await db.select().from(guestsTable).where(eq(guestsTable.id, id)).limit(1);
    if (found.length === 0) return res.status(404).json({ ok: false, error: "guest_not_found" });
    if (found[0]!.checkedInAt) {
      return res.json({ ok: true, alreadyCheckedIn: true, guest: found[0] });
    }
    const updated = await db
      .update(guestsTable)
      .set({ checkedInAt: new Date() })
      .where(eq(guestsTable.id, id))
      .returning();
    return res.json({ ok: true, alreadyCheckedIn: false, guest: updated[0] });
  } catch (err: any) {
    logger.error({ err }, "checkin failed");
    return res.status(500).json({ ok: false, error: err?.message || "server_error" });
  }
});

// DELETE /api/guests/:id — remove a guest
router.delete("/guests/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await db.delete(guestsTable).where(eq(guestsTable.id, id)).returning();
    if (deleted.length === 0) return res.status(404).json({ ok: false, error: "guest_not_found" });
    logger.info({ id }, "guest deleted");
    return res.json({ ok: true, deleted: deleted[0] });
  } catch (err: any) {
    logger.error({ err }, "delete guest failed");
    return res.status(500).json({ ok: false, error: err?.message || "server_error" });
  }
});

export default router;
