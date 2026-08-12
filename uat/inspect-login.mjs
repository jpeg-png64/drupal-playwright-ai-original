import { chromium } from "playwright";

const BASE = "https://builder-clean.docker-uat01.ust.hk";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  httpCredentials: { username: "helper", password: "DaTLLkturGtSUgI0" },
});
const page = await context.newPage();
await page.goto(BASE + "/user/login", { waitUntil: "domcontentloaded" });
console.log("URL:", page.url());
console.log("Title:", await page.title());

const info = await page.evaluate(() => {
  return [...document.querySelectorAll("form")].map((f, i) => ({
    index: i,
    id: f.id,
    className: f.className,
    inputs: [...f.querySelectorAll("input")].map((inp) => ({
      name: inp.name,
      id: inp.id,
      type: inp.type,
      value: inp.value,
      visible: !!(inp.offsetWidth || inp.offsetHeight || inp.getClientRects().length),
    })),
  }));
});
for (const f of info) {
  console.log("\nFORM", f.index, f.id, f.className);
  for (const i of f.inputs) console.log("  ", JSON.stringify(i));
}
await browser.close();
process.exit(0);
