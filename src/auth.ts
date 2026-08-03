const CREDENTIAL_KEY = "lcp-local-credential-v1";
const ITERATIONS = 210_000;

export type LocalCredential = { username: string; salt: string; hash: string };

function bytesToBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes));
}

function base64ToBytes(value: string) {
  return Uint8Array.from(atob(value), character => character.charCodeAt(0));
}

async function derive(passcode: string, salt: Uint8Array) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passcode),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS },
    material,
    256,
  );
  return bytesToBase64(new Uint8Array(bits));
}

export function getCredential(): LocalCredential | null {
  try {
    const value = localStorage.getItem(CREDENTIAL_KEY);
    return value ? JSON.parse(value) as LocalCredential : null;
  } catch {
    return null;
  }
}

export async function createCredential(username: string, passcode: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const credential = { username: username.trim(), salt: bytesToBase64(salt), hash: await derive(passcode, salt) };
  localStorage.setItem(CREDENTIAL_KEY, JSON.stringify(credential));
  return credential;
}

export async function verifyCredential(passcode: string, credential: LocalCredential) {
  const candidate = await derive(passcode, base64ToBytes(credential.salt));
  if (candidate.length !== credential.hash.length) return false;
  let difference = 0;
  for (let index = 0; index < candidate.length; index += 1) {
    difference |= candidate.charCodeAt(index) ^ credential.hash.charCodeAt(index);
  }
  return difference === 0;
}
