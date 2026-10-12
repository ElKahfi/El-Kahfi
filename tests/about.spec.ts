import { test, expect } from "@playwright/test";

test("About content, contacts and responsive static layout", async ({ page }, testInfo) => {
  await page.goto("/#about");
  await expect(page).toHaveTitle("ELKAHFI — System Design");
  await expect(page.getByRole("heading", { name: "About Me", exact: true })).toBeVisible();
  await expect(page.locator(".about-intro p")).toContainText("I build useful systems through effective design.");
  await expect(page.locator(".about-skills ul").nth(0).locator("li")).toHaveText(["Python", "JavaScript", "TypeScript", "React", "HTML", "CSS"]);
  await expect(page.locator(".about-skills ul").nth(1).locator("li")).toHaveText(["SQL", "AWS/Cloud", "Docker"]);
  await expect(page.locator(".about-skills ul").nth(2).locator("li")).toHaveText(["Figma", "GitHub", "VS Code"]);
  for (const [name, href] of [
    ["08151610212", "tel:08151610212"],
    ["Athariq.Elkahfi@gmail.com", "mailto:Athariq.Elkahfi@gmail.com"],
    ["LinkedIn profile", "https://www.linkedin.com/in/athariq-el-kahfi-a20109298/?isSelfProfile=true"],
    ["github.com/ElKahfi", "https://github.com/ElKahfi"],
  ]) await expect(page.getByRole("link", { name, exact: true })).toHaveAttribute("href", href);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator("#about")).toHaveCSS("transform", "none");
  await page.screenshot({ path: testInfo.outputPath("about.png"), fullPage: true });
  await page.getByRole("button", { name: "Navigation menu" }).click();
  await page.getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect.poll(() => page.locator("#work").evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
});

test("About supports keyboard skip, visible contact focus and menu return", async ({ page, isMobile }) => {
  test.skip(isMobile, "Physical keyboard profiles");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await page.locator("#about").focus();
  await page.keyboard.press("Tab");
  const phone = page.getByRole("link", { name: "08151610212" });
  await expect(phone).toBeFocused();
  await expect(phone).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Athariq.Elkahfi@gmail.com" })).toBeFocused();
  await page.getByRole("button", { name: "Navigation menu" }).click();
  await page.getByRole("link", { name: "Intro", exact: true }).click();
  await expect(page).toHaveURL(/\/#top$/);
  await expect(page.getByRole("heading", { name: "ELKAHFI", exact: true })).toBeInViewport();
});

test("previous About URL redirects to the homepage section", async ({ page }) => {
  await page.goto("/about");
  await expect(page).toHaveURL(/\/#about$/);
  await expect(page.getByRole("heading", { name: "About Me", exact: true })).toBeInViewport();
});
