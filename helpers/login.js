import { execSync } from "child_process";

/**
 * Login helper — verifies access via storageState.
 * If storage state is missing/invalid and the base URL is localhost (or
 * ALLOW_DRUSH env is set), attempt drush uli via Docker. For remote sites
 * the helper will instruct the caller to capture a session manually and
 * save it to the configured storage state path.
 */
export async function login(page) {
  const baseURL = process.env.BASE_URL;
  if (!baseURL) {
    throw new Error('BASE_URL is required. Set BASE_URL to the target site URL before running tests (e.g. BASE_URL="https://example.com"). The runner will not default to localhost.');
  }

  // Navigate to the site base URL
  await page.goto(baseURL);
  await page.waitForLoadState("networkidle");

  const url = page.url();
  const bodyText = await page.locator("body").textContent({ timeout: 5000 }).catch(() => "");

  if (!url.includes("HKUST SSO") && !bodyText.includes("Unsupported Request")) {
    console.log("Login OK via storageState");
    return;
  }

  // Storage state expired or invalid — decide fallback behavior
  console.log("Storage state invalid or missing.");

  const allowDrush = baseURL.includes("localhost") || process.env.ALLOW_DRUSH === "true";

  if (allowDrush) {
    console.log("Attempting drush uli via Docker...");
    const loginUrl = execSync(
      "docker compose exec -T drupal10_web drush uli --uri=" + baseURL,
      { cwd: "../Docker/mtpc_template" }
    ).toString().trim();

    await page.goto(loginUrl);
    await page.waitForLoadState("networkidle");

    const newUrl = page.url();
    if (newUrl.includes("HKUST SSO") || newUrl.includes("error")) {
      throw new Error("Login failed — SSO is blocking drush uli token");
    }

    console.log("Login OK via fresh drush uli");

    // Save updated session for other workers
    const { writeFileSync } = await import("fs");
    const storagePath = process.env.STORAGE_STATE || ".auth/storage-state.json";
    const state = await page.context().storageState();
    writeFileSync(storagePath, JSON.stringify(state));
    console.log("Session refreshed in " + storagePath);
    return;
  }

  // For remote sites, instruct manual capture
  const storagePath = process.env.STORAGE_STATE || ".auth/storage-state.json";
  throw new Error(
    `No valid storage state and drush fallback is disabled for ${baseURL}.\n` +
      `Please open the site's login link once in a browser to establish a session, ` +
      `then save the Playwright storage state to ${storagePath}.\n` +
      `Example (in Playwright script):\n` +
      `  const storage = await page.context().storageState();\n` +
      `  require('fs').writeFileSync('${storagePath}', JSON.stringify(storage));\n` +
      `Or set ALLOW_DRUSH=true if you want the helper to attempt a Docker drush uli (only works for localhost Docker setups).`
  );
}
