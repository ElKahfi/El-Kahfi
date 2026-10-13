import { test, expect } from "@playwright/test";

test("SENTRI case study leads with Dispatch and preserves all five readable images", async ({ page }, testInfo) => {
  await page.goto("/projects/sentri");
  await expect(page.getByRole("heading", { name: "SENTRI", exact: true })).toBeInViewport();
  await expect(page.getByText("2026", { exact: true })).toBeInViewport();
  await expect(page.getByRole("heading", { name: "Key capabilities" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "My role" })).toBeVisible();
  await expect(page.locator("aside dd").first()).toHaveText("Team Leader");
  const figures = page.locator(".detail-lead, .case-gallery figure");
  await expect(figures).toHaveCount(5);
  await expect(figures.locator("h2")).toHaveText(["Dispatch — the core training experience", "Technical architecture", "Protocol — Gmail continuation training", "Deployment — admin panel", "Deployment — company setup"]);
  for (const figure of await figures.all()) {
    await figure.scrollIntoViewIfNeeded();
    await expect.poll(() => figure.locator("img").evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(figure.locator("img")).toHaveAttribute("alt", /SENTRI/);
    const link = figure.getByRole("link", { name: "View full-size image" });
    const href = await link.getAttribute("href");
    expect((await page.request.get(href!)).ok()).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("sentri-case-study.png"), fullPage: true });
  await page.getByRole("link", { name: "All projects" }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect.poll(() => page.locator("#work").evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
});
