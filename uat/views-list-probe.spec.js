import { test } from "@playwright/test";
import { writeFileSync, readFileSync } from "fs";

const TARGETS = ["Taxonomy term", "Templates", "Webform submissions"];

test("Fresh page per view -> last 3", async ({ page }) => {
  test.setTimeout(600000);

  await page.goto("/user");
  await page.waitForLoadState("domcontentloaded");
  const ok = await page.locator('a[data-drupal-link-system-path="logout"], a[href*="/logout"], a:has-text("MTPC Administration")').count();
  if (!ok) throw new Error("Not logged in on UAT");

  const agree = page.getByRole("button", { name: "OK, I agree" });
  if (await agree.count()) await agree.click().catch(() => {});

  const results = [];
  const existing = JSON.parse(readFileSync("/tmp/views-list-results.json", "utf8"));
  const keep = existing.filter((r) => !TARGETS.includes(r.name));

  for (let i = 0; i < TARGETS.length; i++) {
    const name = TARGETS[i];
    const errors = [];
    const onError = (e) => errors.push("pageerror: " + e.message);
    const onConsole = (m) => { if (m.type() === "error") errors.push("console: " + m.text()); };
    page.on("pageerror", onError);
    page.on("console", onConsole);

    let rep = null;
    let targetVal = null;
    let status = "?";
    try {
      await page.goto("/node/add/custom_page/mtpc", { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.getByRole("textbox", { name: "Page Title" }).fill("Vlast " + i);
      await page.getByRole("button", { name: "Add 1-Column Section" }).click();
      await page.getByRole("textbox", { name: "Section Name" }).last().fill("S");

      const columnMenu = page.locator('[id*="field-mod-1-col-container-add-more"]').last();
      await columnMenu.getByRole("button", { name: "List additional actions" }).click();
      await page.locator("li.add-more-button-mod-views-block input").click();
      await page.waitForTimeout(4000);

      const viewsInput = page.getByLabel("Views name");
      await viewsInput.waitFor({ state: "visible", timeout: 60000 });
      await viewsInput.fill(name);
      await page.waitForTimeout(2500);

      const items = page.locator(".ui-autocomplete li.ui-menu-item");
      const n = await items.count();
      const texts = [];
      for (let k = 0; k < n; k++) texts.push(((await items.nth(k).textContent()) || "").trim());

      const lower = name.toLowerCase();
      let idx = texts.findIndex((s) => s.toLowerCase().startsWith(lower));
      if (idx === -1 && n === 1) idx = 0;

      if (idx === -1) {
        status = "NO SUGGESTION";
        rep = { exists: null, options: [], values: [], suggestions: texts };
      } else {
        await items.nth(idx).click();
        await page.waitForTimeout(4000);

        const hiddenInput = page.locator('input[name*="field_mtpc_views_block"][name*="[target_id]"]').first();
        targetVal = await hiddenInput.inputValue().catch(() => "");

        const labels = page.getByLabel("Display");
        const total = await labels.count();
        if (total === 0) {
          rep = { exists: false, options: [], values: [], suggestions: texts };
        } else {
          const sel = labels.last();
          const visible = await sel.isVisible().catch(() => false);
          if (!visible) {
            rep = { exists: true, visible: false, options: [], values: [], suggestions: texts };
          } else {
            const options = await sel.locator("option").allTextContents();
            const values = await sel.locator("option").evaluateAll((els) => els.map((el) => el.value));
            rep = { exists: true, visible: true, options, values, suggestions: texts };
          }
        }
        status = rep.exists === false ? "NO DISPLAY DROPDOWN" : "OK";
      }
    } catch (e) {
      status = "ERROR: " + e.message;
    } finally {
      page.off("pageerror", onError);
      page.off("console", onConsole);
    }

    const r = {
      name,
      status,
      target: targetVal,
      suggestions: rep?.suggestions || [],
      displayExists: rep?.exists ?? null,
      displayVisible: rep?.visible ?? null,
      options: rep?.options || [],
      values: rep?.values || [],
      errors,
    };
    results.push(r);
    console.log((i + 1) + "/" + TARGETS.length + " " + name + " -> " + status + " | Display: " + (rep?.exists === false ? "NO DROPDOWN" : JSON.stringify(rep?.options || [])) + (errors.length ? " | ERRORS: " + errors.join(" // ") : ""));
  }

  const all = [...keep, ...results];
  writeFileSync("/tmp/views-list-results.json", JSON.stringify(all, null, 2));
  console.log("WROTE /tmp/views-list-results.json (" + all.length + " total)");
});
