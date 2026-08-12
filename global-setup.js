import { chromium } from "@playwright/test";
import { execSync } from "child_process";
import { mkdirSync, writeFileSync, existsSync } from "fs";

const STORAGE_PATH = process.env.STORAGE_STATE || ".auth/storage-state.json";

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

  const BASE_URL = process.env.BASE_URL;
  if (!BASE_URL) {
    throw new Error('[globalSetup] BASE_URL is required. Set BASE_URL to your Drupal site (e.g. BASE_URL="https://example.com") and provide a captured storage state at ' + STORAGE_PATH + ' before running tests.');
  }

  const allowDrush = BASE_URL.includes("localhost") || process.env.ALLOW_DRUSH === "true";
  const LOGIN_LINK = process.env.LOGIN_LINK;

  // If the caller provided a LOGIN_LINK, open it and let the user authenticate manually.
  if (LOGIN_LINK) {
    console.log('[globalSetup] LOGIN_LINK provided — opening browser for manual login...');
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(LOGIN_LINK);
    await page.waitForLoadState('networkidle');

    console.log('[globalSetup] Complete login in the opened browser window. When done, return here and press ENTER to continue (this saves the authenticated storage state).');

    await new Promise((resolve) => {
      process.stdin.resume();
      process.stdin.once('data', async () => {
        try {
          const storageState = await context.storageState();
          writeFileSync(STORAGE_PATH, JSON.stringify(storageState));
          console.log('[globalSetup] Storage state saved to ' + STORAGE_PATH);
        } catch (err) {
          console.error('[globalSetup] Failed to save storage state:', err);
          await browser.close();
          process.exit(1);
        }
        await browser.close();
        process.stdin.pause();
        resolve();
      });
    });

    // Verify saved session
    console.log('[globalSetup] Verifying saved session...');
    const recheck = await verifySession();
    if (!recheck) {
      throw new Error('[globalSetup] Saved session failed verification');
    }
    console.log('[globalSetup] All clear — workers can proceed');
    return;
  }

  if (!allowDrush) {
    throw new Error('[globalSetup] No valid storage state and no LOGIN_LINK was provided for ' + BASE_URL + '.\n' +
      'Provide LOGIN_LINK as an env var to let you paste a one-time login URL for interactive capture, or capture storage state manually and save to ' + STORAGE_PATH + '.\n' +
      'Example: LOGIN_LINK="https://example.com/user/reset/one-time-link" BASE_URL="https://example.com" STORAGE_STATE="' + STORAGE_PATH + '" npx playwright test tests/image.spec.js');
  }

  // Generate fresh login via drush uli (localhost Docker only)
  console.log("[globalSetup] Generating login token via drush uli...");
  const loginUrl = execSync(
    "docker compose exec -T drupal10_web drush uli --uri=" + BASE_URL,
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
