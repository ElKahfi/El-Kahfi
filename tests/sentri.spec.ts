import { test, expect } from "@playwright/test";

test("SENTRI case study leads with Dispatch and preserves all five readable images", async ({ page }, testInfo) => {
  await page.goto("/projects/sentri");
  await expect(page.getByRole("heading", { name: "SENTRI", exact: true })).toBeInViewport();
  await expect(page.getByText("2026", { exact: true })).toBeInViewport();
  await expect(page.getByRole("heading", { name: "Key capabilities" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "My role" })).toBeVisible();
  await expect(page.locator("aside dd").first()).toHaveText("Team Leader");
  const originalViewport = page.viewportSize()!;
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const layout = await page.locator(".detail-body").evaluate(el => {
      const overview = el.querySelector("aside")!.getBoundingClientRect();
      const cards = Array.from(el.querySelectorAll(".detail-story section"), card => card.getBoundingClientRect());
      return { center: overview.x + overview.width / 2, bottom: overview.bottom,
        cards: cards.map(card => ({ x: card.x, y: card.y, width: card.width, height: card.height, bottom: card.bottom })), overflow: document.documentElement.scrollWidth > innerWidth };
    });
    expect(Math.abs(layout.center - width / 2)).toBeLessThan(2);
    expect(layout.bottom).toBeLessThan(layout.cards[0].y);
    expect(layout.overflow).toBe(false);
    expect(Math.abs(layout.cards[0].width - layout.cards[1].width)).toBeLessThan(2);
    if (width >= 900) {
      expect(layout.cards[0].y).toBe(layout.cards[1].y);
      expect(layout.cards[0].height).toBe(layout.cards[1].height);
    } else {
      expect(layout.cards[0].bottom).toBeLessThan(layout.cards[1].y);
    }
  }
  await page.setViewportSize(originalViewport);
  const figure = page.locator(".rotator-slide");
  for (const title of ["Dispatch — the core training experience", "Protocol — Gmail continuation training", "Deployment — admin panel", "Deployment — company setup", "Technical architecture"]) {
    await expect(figure.locator("h2")).toHaveText(title);
    await figure.scrollIntoViewIfNeeded();
    await expect.poll(() => figure.locator("img").evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(figure.locator("img")).toHaveAttribute("alt", /SENTRI/);
    await expect(figure.getByRole("link", { name: "View full-size image" })).toHaveCount(0);
    await page.getByRole("button", { name: "Next slide" }).click();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("sentri-case-study.png"), fullPage: true });
  await page.getByRole("link", { name: "All projects" }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect.poll(() => page.locator("#work").evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
});
