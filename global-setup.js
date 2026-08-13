import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { isLoggedIn } from "./helpers/login.js";

const STORAGE_PATH = process.env.STORAGE_STATE || ".auth/storage-state.json";
const BASE_URL = process.env.BASE_URL;

const BASIC_AUTH = process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASS
  ? { username: process.env.BASIC_AUTH_USER, password: process.env.BASIC_AUTH_PASS }
  : undefined;

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
    console.log("[globalSetup] Session expired, capturing a fresh one...");
  }

  if (!BASE_URL) {
    throw new Error('[globalSetup] BASE_URL is required. Set BASE_URL to your Drupal site (e.g. BASE_URL="https://example.com") and provide a captured storage state at ' + STORAGE_PATH + ' before running tests.');
  }

  const LOGIN_LINK = process.env.LOGIN_LINK;

  // If the caller provided a LOGIN_LINK, open it and let the user authenticate manually.
  if (!LOGIN_LINK) {
    throw new Error('[globalSetup] No valid storage state and no LOGIN_LINK was provided for ' + BASE_URL + '.\n' +
      'Provide LOGIN_LINK as an env var to let you open a one-time login URL for interactive capture, or capture storage state manually and save to ' + STORAGE_PATH + '.\n' +
      'Example: LOGIN_LINK="https://example.com/user/reset/one-time-link" BASE_URL="https://example.com" STORAGE_STATE="' + STORAGE_PATH + '" npx playwright test tests/image.spec.js');
  }

  console.log('[globalSetup] LOGIN_LINK provided — opening browser for manual login...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ httpCredentials: BASIC_AUTH });
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
}

async function verifySession() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ storageState: STORAGE_PATH, httpCredentials: BASIC_AUTH });
    const page = await context.newPage();

    await page.goto(BASE_URL + "/user", { waitUntil: "domcontentloaded" });

    const ok = await isLoggedIn(page);

    await browser.close();
    return ok;
  } catch {
    if (browser) await browser.close().catch(() => {});
    return false;
  }
}

export default globalSetup;
