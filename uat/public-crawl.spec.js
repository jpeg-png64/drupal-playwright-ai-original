import { test } from "@playwright/test";

const KNOWN_ANON_PATHS = [
  // Drupal well-known / version / misconfig probes (informational)
  "/CHANGELOG.txt",
  "/README.txt",
  "/INSTALL.txt",
  "/WEB.txt",
  "/core/CHANGELOG.txt",
  "/sites/default/files/",
  "/sites/default/settings.php",
  "/.git/HEAD",
  "/.env",
  "/install.php",
  "/update.php",
  "/xmlrpc.php",
  "/web.config",
  "/.htaccess",
  // Public content / API endpoints
  "/rss.xml",
  "/jsonapi",
  "/node/1",
  "/node/1.json",
  "/node/1/edit",
  "/user",
  "/user/login",
  "/user/1",
  "/user/1/edit",
  "/admin",
  "/admin/config",
  "/admin/reports/dblog",
  "/admin/event-registration/overview",
  "/admin/config/people/otp",
  "/style-guide",
  "/people",
  "/events",
  "/news",
  "/multimedia",
  "/node",
  "/sitemap.xml",
  "/robots.txt",
  "/favicon.ico",
  // Frontend ajax used by blocks
  "/ajax/load_video/1",
  "/ajax/load_video/999999",
];

const ERROR_RE = /unexpected error|Oops|The website encountered|TypeError|ErrorException|Exception occurred|Whoops|Internal Server Error/;

test.describe("UAT Anonymous Probe - builder-clean", () => {
  test("Crawl public pages + endpoint probes for 5xx / errors", async ({ page }) => {
    test.setTimeout(900000);

    const visited = new Set();
    const queue = ["/"];
    const broken = [];

    await test.step("BFS crawl of public pages", async () => {
      let pages = 0;
      while (queue.length && pages < 200) {
        const path = queue.shift();
        if (visited.has(path)) continue;
        visited.add(path);
        let status = "?";
        let text = "";
        try {
          const resp = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 30000 });
          status = resp ? resp.status() : "?";
          text = (await page.locator("body").innerText().catch(() => "")).slice(0, 300).replace(/\s+/g, " ");
        } catch (e) {
          status = "ERR";
          text = String(e).slice(0, 150);
        }
        pages++;
        const isError = status >= 500 || ERROR_RE.test(text);
        if (isError || status >= 400) {
          broken.push({ path, status, text });
          console.log(`[${status}]${isError ? " ERROR" : ""} ${path}  (${text.slice(0, 120)})`);
        }
        if (status === 200) {
          const links = await page
            .evaluate(() => {
              const out = [];
              for (const a of document.querySelectorAll("a[href]")) {
                try {
                  const u = new URL(a.href, location.href);
                  if (u.origin === location.origin) out.push(u.pathname + u.search);
                } catch {}
              }
              return out;
            })
            .catch(() => []);
          for (const l of links.slice(0, 60)) {
            if (!visited.has(l)) queue.push(l);
          }
        }
      }
      console.log(`crawled: ${pages} pages`);
    });

    await test.step("Endpoint probes (anonymous)", async () => {
      for (const path of KNOWN_ANON_PATHS) {
        if (visited.has(path)) continue;
        let status = "?";
        let text = "";
        try {
          const resp = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 30000 });
          status = resp ? resp.status() : "?";
          text = (await page.locator("body").innerText().catch(() => "")).slice(0, 200).replace(/\s+/g, " ");
        } catch (e) {
          status = "ERR";
          text = String(e).slice(0, 120);
        }
        const isError = status >= 500 || ERROR_RE.test(text);
        if (isError) {
          broken.push({ path, status, text });
          console.log(`[${status}] ERROR ${path}  (${text.slice(0, 150)})`);
        } else {
          console.log(`[${status}] ${path}`);
        }
      }
    });

    console.log("=== ANONYMOUS PROBE SUMMARY ===");
    if (!broken.length) console.log("No 5xx or error pages found anonymously.");
    for (const b of broken) {
      console.log(`FAIL [${b.status}] ${b.path} :: ${b.text.slice(0, 160)}`);
    }
  });
});
