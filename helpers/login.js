import { execSync } from "child_process";

/**
 * Login helper — verifies access via storageState, falls back to drush uli if needed.
 */
export async function login(page) {
  // Try the site with saved cookies
  await page.goto("http://localhost:8325");
  await page.waitForLoadState("networkidle");

  const url = page.url();
  const bodyText = await page.locator("body").textContent({ timeout: 5000 }).catch(() => "");

  if (!url.includes("HKUST SSO") && !bodyText.includes("Unsupported Request")) {
    return;
  }

  // Storage state expired or invalid — fresh login
  const loginUrl = execSync(
    "docker compose exec -T drupal10_web drush uli --uri=http://localhost:8325",
    { cwd: "../Docker/mtpc_template" }
  ).toString().trim();
  await page.goto(loginUrl);
  await page.waitForLoadState("networkidle");

  // Verify fresh login worked
  const newUrl = page.url();
  if (newUrl.includes("HKUST SSO") || newUrl.includes("error")) {
    throw new Error("Login failed — SSO is blocking drush uli token");
  }

  // Save updated session for other workers
  const { writeFileSync } = await import("fs");
  const state = await page.context().storageState();
  writeFileSync(".auth/storage-state.json", JSON.stringify(state));
}
