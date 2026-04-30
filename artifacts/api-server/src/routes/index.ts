import { Router, type IRouter } from "express";
import express from "express";
import path from "node:path";
import healthRouter from "./health";
import rsvpRouter from "./rsvp";

const router: IRouter = Router();

router.use(healthRouter);
router.use(rsvpRouter);

// Serve generated QR code PNGs publicly so Twilio can fetch them as MediaUrl
router.use(
  "/qr",
  express.static(path.resolve(process.cwd(), "qr-codes"), {
    maxAge: "1h",
    fallthrough: false,
  }),
);

export default router;
