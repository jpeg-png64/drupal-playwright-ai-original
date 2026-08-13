/**
 * Login helper — verifies admin access via the given-link workflow.
 * Sessions are captured once (open the provided one-time login link in a
 * browser) and saved to the configured storage state; Playwright replays it.
 * No drush, no localhost assumptions, no SSO-page heuristics.
 */
export async function login(page) {
  const baseURL = process.env.BASE_URL;
  if (!baseURL) {
    throw new Error('BASE_URL is required. Set BASE_URL to the target site URL before running tests (e.g. BASE_URL="https://example.com").');
  }

  await page.goto(baseURL);
  await page.waitForLoadState("domcontentloaded");

  const loggedIn = await isLoggedIn(page);
  if (loggedIn) {
    console.log("Login OK via storageState");
    return;
  }

  // Storage state expired or invalid — instruct the given-link workflow.
  const storagePath = process.env.STORAGE_STATE || ".auth/storage-state.json";
  throw new Error(
    `No valid session for ${baseURL}.\n` +
      `Open the site's one-time login link once in a browser to establish a session, ` +
      `then save the Playwright storage state to ${storagePath}.\n` +
      `Example (in Playwright script):\n` +
      `  const storage = await page.context().storageState();\n` +
      `  require('fs').writeFileSync('${storagePath}', JSON.stringify(storage));`
  );
}

export async function isLoggedIn(page) {
  const logoutLink = page.locator('a[data-drupal-link-system-path="logout"], a[href*="/logout"]');
  const adminLink = page.locator('a:has-text("MTPC Administration")');
  return (await logoutLink.count()) > 0 || (await adminLink.count()) > 0;
}
