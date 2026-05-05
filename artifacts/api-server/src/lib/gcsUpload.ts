import { Storage } from "@google-cloud/storage";

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

async function getRealAccessToken(): Promise<string> {
  const credResp = await fetch(`${REPLIT_SIDECAR_ENDPOINT}/credential`);
  const { access_token: subjectToken } = (await credResp.json()) as any;

  const stsResp = await fetch(`${REPLIT_SIDECAR_ENDPOINT}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
      subject_token_type: "urn:ietf:params:oauth:token-type:access_token",
      subject_token: subjectToken,
    }),
  });
  const { access_token } = (await stsResp.json()) as any;
  if (!access_token) throw new Error("STS token exchange returned no access_token");
  return access_token;
}

export async function uploadAndGetPublicUrl(
  objectName: string,
  buf: Buffer,
  contentType: string,
): Promise<string> {
  if (!BUCKET_ID) throw new Error("DEFAULT_OBJECT_STORAGE_BUCKET_ID not set");

  const file = gcs.bucket(BUCKET_ID).file(objectName);
  await file.save(buf, { contentType, resumable: false });

  const accessToken = await getRealAccessToken();
  const encodedObject = encodeURIComponent(objectName);
  return `https://storage.googleapis.com/storage/v1/b/${BUCKET_ID}/o/${encodedObject}?alt=media&access_token=${accessToken}`;
}

export async function uploadAndGetAccessTokenUrl(
  objectName: string,
  buf: Buffer,
  contentType: string,
): Promise<string> {
  return uploadAndGetPublicUrl(objectName, buf, contentType);
}
