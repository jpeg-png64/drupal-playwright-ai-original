import { chromium } from "@playwright/test";
import { execSync } from "child_process";
import { mkdirSync, writeFileSync, existsSync } from "fs";

const STORAGE_PATH = ".auth/storage-state.json";

async function globalSetup() {
  mkdirSync(".auth", { recursive: true });

  // If storage state exists, verify it works first
  if (existsSync(STORAGE_PATH)) {
    console.log("[globalSetup] Found existing session — verifying...");
    const valid = await verifySession();
    if (valid) {
      console.log("[globalSetup] Session still valid, reusing");
      return;
    }
    console.log("[globalSetup] Session expired, generating fresh one...");
  }

  // Generate fresh login
  console.log("[globalSetup] Generating login token via drush uli...");
  const loginUrl = execSync(
    "docker compose exec -T drupal10_web drush uli --uri=http://localhost:8325",
    { cwd: "../Docker/mtpc_template" }
  ).toString().trim();

  console.log("[globalSetup] Logging in...");
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(loginUrl);
  await page.waitForLoadState("networkidle");

  // Verify we actually reached Drupal, not SSO error
  const url = page.url();
  const body = await page.locator("body").textContent({ timeout: 5000 }).catch(() => "");

  if (url.includes("HKUST SSO") || body.includes("Unsupported Request")) {
    await browser.close();
    throw new Error("[globalSetup] Login failed — SSO blocked the token");
  }

  // Save session
  const storageState = await context.storageState();
  writeFileSync(STORAGE_PATH, JSON.stringify(storageState));
  await browser.close();

  console.log("[globalSetup] Login confirmed — session saved");

  // Now verify the saved session works (proves workers will be fine)
  console.log("[globalSetup] Verifying saved session...");
  const recheck = await verifySession();
  if (!recheck) {
    throw new Error("[globalSetup] Saved session failed verification");
  }
  console.log("[globalSetup] All clear — workers can proceed");
}

async function verifySession() {
  let browser;
  try {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();

    await page.goto("http://localhost:8325");
    await page.waitForLoadState("networkidle");

    const url = page.url();
    const body = await page.locator("body").textContent({ timeout: 5000 }).catch(() => "");

    const ok = !url.includes("HKUST SSO") && !body.includes("Unsupported Request");

    await browser.close();
    return ok;
  } catch {
    if (browser) await browser.close().catch(() => {});
    return false;
  }
}

export default globalSetup;
