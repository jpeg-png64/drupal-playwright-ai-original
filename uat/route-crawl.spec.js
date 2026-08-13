import { test, expect } from "@playwright/test";

const ADMIN_ROUTES = [
  // Admin dashboard & content
  "/admin",
  "/admin/content",
  "/admin/content/media",
  "/admin/landing-page/overview",
  "/admin/landing-page/path-update",
  "/node/add",
  // Structure
  "/admin/structure",
  "/admin/structure/types",
  "/admin/structure/types/manage/custom_page",
  "/admin/structure/types/manage/custom_page/fields",
  "/admin/structure/types/manage/custom_page/form-display",
  "/admin/structure/types/manage/custom_page/display",
  "/admin/structure/types/manage/news",
  "/admin/structure/paragraphs_type",
  "/admin/structure/block",
  "/admin/structure/block/block-content",
  "/admin/structure/block-content/types",
  "/admin/structure/views",
  "/admin/structure/menu",
  "/admin/structure/taxonomy",
  "/admin/structure/webform",
  "/admin/structure/entityqueue",
  "/admin/structure/config_pages",
  "/admin/structure/config_pages/types",
  "/admin/structure/comment",
  "/admin/structure/contact",
  "/admin/structure/display-modes",
  "/admin/structure/feed",
  "/admin/structure/file-types",
  "/admin/structure/media",
  // Config
  "/admin/config",
  "/admin/config/development",
  "/admin/config/development/logging",
  "/admin/config/development/performance",
  "/admin/config/development/maintenance",
  "/admin/config/development/configuration",
  "/admin/config/development/configuration/single/export",
  "/admin/config/development/configuration/single/import",
  "/admin/config/people",
  "/admin/config/people/accounts",
  "/admin/config/people/accounts/fields",
  "/admin/config/system",
  "/admin/config/system/site-information",
  "/admin/config/system/cron",
  "/admin/config/media",
  "/admin/config/media/image-styles",
  "/admin/config/content",
  "/admin/config/content/formats",
  "/admin/config/search",
  "/admin/config/search/search-api",
  "/admin/config/search/pages",
  "/admin/config/regional",
  "/admin/config/regional/language",
  "/admin/config/regional/content-language",
  "/admin/config/services",
  "/admin/config/workflow",
  // Modules / people / reports
  "/admin/modules",
  "/admin/modules/uninstall",
  "/admin/people",
  "/admin/role-mapping",
  "/admin/role-mapping/config",
  "/admin/reports",
  "/admin/reports/status",
  "/admin/reports/availability",
  "/admin/reports/dblog",
  "/admin/reports/page-not-found",
  "/admin/reports/access-denied",
  // Custom MTPC modules
  "/admin/hkust-events",
  "/admin/hkust-multimedia",
  "/admin/hkust_people_edit_form/cat",
  "/admin/config/mtpc",
  // Content type add forms
  "/node/add/album",
  "/node/add/article",
  "/node/add/basic_page",
  "/node/add/basic_tabs",
  "/node/add/document_library",
  "/node/add/event_registration",
  "/node/add/events",
  "/node/add/external_media",
  "/node/add/faq",
  "/node/add/landing_page",
  "/node/add/multimedia",
  "/node/add/news",
  "/node/add/people",
  "/node/add/photo_video_album",
  "/node/add/custom_page",
  "/node/add/template",
  "/node/add/webform",
];

const ERROR_RE = /unexpected error|Oops|The website encountered|TypeError|ErrorException|Exception occurred|Whoops|500 Server/;

test.describe("UAT Route Crawl - builder-clean", () => {
  test("Crawl admin + content-type add forms for errors", async ({ page }) => {
    test.setTimeout(900000);

    const results = [];
    let loggedIn = false;

    await test.step("Check session", async () => {
      await page.goto("/user", { waitUntil: "domcontentloaded" });
      const logoutLink = page.locator('a[data-drupal-link-system-path="logout"], a[href*="/logout"]');
      const adminLink = page.locator('a:has-text("MTPC Administration")');
      loggedIn = (await logoutLink.count()) > 0 || (await adminLink.count()) > 0;
      console.log(`SESSION logged-in=${loggedIn}`);
    });

    if (!loggedIn) {
      console.log("NOT LOGGED IN - admin crawl skipped. Refresh .auth/storage-state-builder-clean.json and re-run.");
    }

    await test.step("Crawl admin routes", async () => {
      if (!loggedIn) return;
      for (const route of ADMIN_ROUTES) {
        let status = "?";
        let snippet = "";
        try {
          const resp = await page.goto(route, { waitUntil: "domcontentloaded", timeout: 45000 });
          status = resp ? resp.status() : "?";
          const text = (await page.locator("body").innerText().catch(() => "")).slice(0, 300).replace(/\s+/g, " ");
          snippet = text;
        } catch (e) {
          status = "ERR";
          snippet = String(e).slice(0, 150);
        }
        const isError = status >= 500 || ERROR_RE.test(snippet);
        const isLoginRedirect = /log in|login|User account/i.test(snippet) && !snippet.includes("logout");
        const is404 = status === 404;
        const is403 = status === 403;
        results.push({ route, status, isError, isLoginRedirect, is404, is403, snippet });
        console.log(`[${status}]${isError ? " ERROR" : ""}${is404 ? " 404" : ""}${is403 ? " 403" : ""}${isLoginRedirect ? " LOGIN-REDIRECT" : ""} ${route}`);
      }
    });

    await test.step("Crawl frontend sitemap", async () => {
      const resp = await page.goto("/sitemap.xml", { waitUntil: "domcontentloaded", timeout: 45000 });
      const status = resp ? resp.status() : "?";
      console.log(`sitemap.xml status=${status}`);
      if (status !== 200) return;
      const xml = await page.locator("body").innerText().catch(() => "");
      const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
      console.log(`sitemap entries: ${urls.length}`);
      const frontResults = [];
      for (const url of urls.slice(0, 100)) {
        try {
          const r = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
          const st = r ? r.status() : "?";
          const text = (await page.locator("body").innerText().catch(() => "")).slice(0, 300).replace(/\s+/g, " ");
          const isError = st >= 500 || ERROR_RE.test(text);
          frontResults.push({ url, status: st, isError, snippet: text });
          if (st >= 400 || isError) console.log(`[${st}]${isError ? " ERROR" : ""} ${url}`);
        } catch (e) {
          frontResults.push({ url, status: "ERR", isError: true, snippet: String(e).slice(0, 150) });
          console.log(`[ERR] ${url} ${String(e).slice(0, 150)}`);
        }
      }
      console.log(`FRONTEND: ${frontResults.length} crawled, errors: ${frontResults.filter((r) => r.isError).length}`);
    });

    await test.step("Check dblog for PHP errors", async () => {
      if (!loggedIn) return;
      await page.goto("/admin/reports/dblog?type[]=php", { waitUntil: "domcontentloaded", timeout: 45000 });
      const text = await page.locator("body").innerText().catch(() => "");
      const lines = text.split("\n").filter((l) => /deprecat|Error|Exception|failed|warning/i.test(l));
      console.log(`DBLOG php lines matching: ${lines.length}`);
      lines.slice(0, 40).forEach((l) => console.log("  DBLOG:", l.trim().slice(0, 200)));
    });

    const errors = results.filter((r) => r.isError);
    const four0x = results.filter((r) => r.status >= 400 && r.status < 500);
    console.log("=== SUMMARY ===");
    console.log(`admin routes crawled: ${results.length}, 5xx/ERROR: ${errors.length}, 4xx: ${four0x.length}`);
    for (const r of errors) {
      console.log(`ERROR ${r.status} ${r.route} :: ${r.snippet.slice(0, 180)}`);
    }
    for (const r of four0x) {
      console.log(`${r.status} ${r.route}${r.isLoginRedirect ? " (login redirect)" : ""}`);
    }
  });
});
