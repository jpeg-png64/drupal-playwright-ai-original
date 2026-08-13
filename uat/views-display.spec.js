import { test } from "@playwright/test";

// DISCOVERY probe: finds the 42 autocomplete entries (per-letter sweep) and does
// a first-pass sequential check of the Display dropdown.
//
// The sequential reuse of one block is UNRELIABLE for the Display options — AJAX
// stops repopulating them after a few iterations (everything shows "- Select -",
// even for views that DO expose block displays). The authoritative per-view
// results come from uat/views-list-probe.spec.js, which creates a FRESH page per
// view. That output is what was logged into results/views-autofill-list.md.

test("Probe views autocomplete -> Display dropdown", async ({ page }) => {
  test.setTimeout(600000);

  await test.step("Verify UAT login", async () => {
    await page.goto("/user");
    await page.waitForLoadState("domcontentloaded");
    const logoutLink = page.locator('a[data-drupal-link-system-path="logout"], a[href*="/logout"]');
    const adminLink = page.getByRole("link", { name: "MTPC Administration" });
    if ((await logoutLink.count()) === 0 && (await adminLink.count()) === 0) {
      throw new Error("Not logged in on UAT");
    }
    console.log("Login OK (admin toolbar / logout link present)");
  });

  await test.step("Dismiss cookie banner", async () => {
    const agree = page.getByRole("button", { name: "OK, I agree" });
    if (await agree.count()) {
      await agree.click().catch(() => {});
      await page.waitForTimeout(800);
    }
  });

  await test.step("Create Standard Page", async () => {
    await page.goto("/node/add/custom_page/mtpc");
    await page.waitForLoadState("domcontentloaded");
    await page.getByRole("textbox", { name: "Page Title" }).fill("Views Display Probe");
  });

  await test.step("Add 1-column section", async () => {
    await page.getByRole("button", { name: "Add 1-Column Section" }).click();
    await page.getByRole("textbox", { name: "Section Name" }).last().fill("Probe Section");
  });

  await test.step("Add Views Block", async () => {
    const columnMenu = page.locator('[id*="field-mod-1-col-container-add-more"]').last();
    await columnMenu.getByRole("button", { name: "List additional actions" }).click();
    await page.locator("li.add-more-button-mod-views-block input").click();
    await page.waitForTimeout(4000);
  });

  const viewsInput = page.getByLabel("Views name");
  await viewsInput.waitFor({ state: "visible", timeout: 60000 });

  async function readSuggestions() {
    await page.waitForTimeout(2500);
    return page.locator(".ui-autocomplete li.ui-menu-item").allTextContents();
  }

  async function clearSelection() {
    const input = page.getByLabel("Views name").last();
    const formItem = input.locator("xpath=ancestor::div[contains(@class,'form-item')][1]").first();
    const buttons = formItem.locator("button, a");
    const n = await buttons.count();
    for (let i = 0; i < n; i++) {
      const b = buttons.nth(i);
      const txt = ((await b.textContent().catch(() => "")) || "").trim().toLowerCase();
      const title = ((await b.getAttribute("title").catch(() => "")) || "").toLowerCase();
      const aria = ((await b.getAttribute("aria-label").catch(() => "")) || "").toLowerCase();
      if (txt.includes("remove") || title.includes("remove") || aria.includes("remove")) {
        await b.click();
        await page.waitForTimeout(1500);
        return true;
      }
    }
    return false;
  }

  // --- 1) Discover every view name in the autocomplete by probing letters ---
  const found = [];
  const seen = new Set();
  console.log("\n=== AUTOCOMPLETE PER LETTER ===");
  for (const ch of "abcdefghijklmnopqrstuvwxyz") {
    await viewsInput.fill(ch);
    const texts = await readSuggestions();
    const labels = texts.map((t) => t.trim());
    console.log("[" + ch + "] -> " + (labels.length ? labels.join(" | ") : "(none)"));
    for (const t of labels) {
      const label = t.split("(")[0].trim();
      if (label && !seen.has(label)) {
        seen.add(label);
        found.push(label);
      }
    }
  }
  console.log("\n=== DISCOVERED AUTOCOMPLETE OPTIONS (" + found.length + ") ===");
  for (const l of found) console.log("  - " + l);

  // --- 2) For each view: check Display dropdown existence + options ---
  const results = [];
  for (let idx = 0; idx < found.length; idx++) {
    const label = found[idx];
    await viewsInput.fill(label);
    const items = page.locator(".ui-autocomplete li.ui-menu-item");
    await page.waitForTimeout(2500);
    const n = await items.count();
    let clicked = false;
    for (let i = 0; i < n; i++) {
      const t = (await items.nth(i).textContent()) || "";
      if (t.trim().startsWith(label)) {
        await items.nth(i).click();
        clicked = true;
        break;
      }
    }
    if (!clicked) {
      results.push({ view: label, status: "NOT SELECTABLE" });
      continue;
    }
    await page.waitForTimeout(2500);

    const before = await displayReport(page);
    const after = await displayReport(page);

    results.push({
      view: label,
      status: "OK",
      displayExistsBefore: before.exists,
      displayOptionsBefore: before.options,
      displayExistsAfter: after.exists,
      displayOptionsAfter: after.options,
    });

    if (idx === 0) {
      const formItem = viewsInput
        .locator("xpath=ancestor::div[contains(@class,'form-item')][1]")
        .first();
      const html = await formItem.evaluate((el) => el.outerHTML).catch(() => "(no html)");
      console.log("\n=== FORM ITEM HTML (after first selection) ===");
      console.log(html);
    }

    const cleared = await clearSelection();
    if (!cleared) {
      console.log("WARNING: could not clear selection for '" + label + "' — trying to continue");
    }
  }

  console.log("\n=== RESULTS ===");
  for (const r of results) {
    console.log("VIEW: " + r.view + "  [" + r.status + "]");
    if (r.status === "OK") {
      console.log("  Display exists BEFORE select: " + (r.displayExistsBefore ? "YES" : "NO"));
      if (r.displayExistsBefore) console.log("    options before: " + JSON.stringify(r.displayOptionsBefore));
      console.log("  Display exists AFTER select: " + (r.displayExistsAfter ? "YES" : "NO"));
      console.log("    options after:  " + JSON.stringify(r.displayOptionsAfter));
    }
  }
});

async function displayReport(page) {
  const loc = page.getByLabel("Display");
  const count = await loc.count();
  if (count === 0) return { exists: false, options: [] };
  const target = loc.last();
  const visible = await target.isVisible().catch(() => false);
  if (!visible) return { exists: true, options: ["(not visible)"] };
  const options = await target.locator("option").allTextContents();
  const values = await target.locator("option").evaluateAll((els) => els.map((el) => el.value));
  return {
    exists: true,
    options,
    values,
    optionsCount: count,
  };
}
