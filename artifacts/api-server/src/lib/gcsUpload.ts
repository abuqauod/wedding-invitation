import { Storage } from "@google-cloud/storage";
import { logger } from "./logger";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const gcs = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: { type: "json", subject_token_field_name: "access_token" },
    },
    universe_domain: "googleapis.com",
  } as any,
  projectId: "",
});

const BUCKET_ID = process.env["DEFAULT_OBJECT_STORAGE_BUCKET_ID"] || "";

/**
 * Uploads a buffer to GCS, makes the object publicly readable,
 * and returns a stable permanent URL that never expires.
 *
 * Previously this function returned a URL with a short-lived access_token
 * (~1 hour), which caused Twilio to fail fetching media after the token
 * expired. By calling makePublic() we get a permanent
 * https://storage.googleapis.com/<bucket>/<object> URL instead.
 */
export async function uploadAndGetPublicUrl(
  objectName: string,
  buf: Buffer,
  contentType: string,
): Promise<string> {
  if (!BUCKET_ID) throw new Error("DEFAULT_OBJECT_STORAGE_BUCKET_ID not set");

  const file = gcs.bucket(BUCKET_ID).file(objectName);
  await file.save(buf, { contentType, resumable: false });

  try {
    await file.makePublic();
  } catch (err) {
    logger.warn({ err, objectName }, "makePublic() failed — object may not be publicly accessible");
    throw err;
  }

  const encodedObject = encodeURIComponent(objectName);
  return `https://storage.googleapis.com/${BUCKET_ID}/${encodedObject}`;
}

/**
 * @deprecated Use uploadAndGetPublicUrl instead.
 * Kept for backward compatibility; now delegates to the public-URL variant.
 */
export async function uploadAndGetAccessTokenUrl(
  objectName: string,
  buf: Buffer,
  contentType: string,
): Promise<string> {
  return uploadAndGetPublicUrl(objectName, buf, contentType);
}
