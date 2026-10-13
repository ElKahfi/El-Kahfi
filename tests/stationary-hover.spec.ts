import { test, expect } from "@playwright/test";

test("stationary pointer discovers projects after scrolling and respects dismissal", async ({ page }, info) => {
  test.skip(info.project.name === "mobile", "Touch has inline summaries");
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Navigation menu" });
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await menu.click();
  const preview = page.locator(".project-preview");
  await page.mouse.move(800, 400);
  for (const [y, title, id] of [[900, "SENTRI", "work"], [1800, "Communimate", "communimate"], [2700, "Mojo", "mojo"], [1800, "Communimate", "communimate"], [900, "SENTRI", "work"]] as const) {
    const previous = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, y - previous);
    await expect(preview).not.toHaveClass(/is-visible/);
    await expect(preview).toHaveClass(/is-visible/);
    await expect(preview.locator("h3")).toHaveText(title);
    const art = page.locator(`#${id} .project-art`);
    const expected = info.project.name === "desktop" ? 1.04 : 1;
    await expect.poll(() => art.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m11)).toBeCloseTo(expected, 3);
  }
  if (info.project.name === "desktop") {
    await expect.poll(() => preview.locator("video").evaluate(el => (el as HTMLVideoElement).currentTime)).toBeGreaterThan(0.1);
    await expect.poll(() => page.locator("#communimate .project-art").evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m11)).toBe(1);
  } else {
    await expect(preview.locator("video")).not.toHaveAttribute("src", /mp4/);
  }
  await page.keyboard.press("Escape");
  await expect(preview).not.toHaveClass(/is-visible/);
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(1100);
  await expect(preview).not.toHaveClass(/is-visible/);
  await page.mouse.move(810, 410);
  await expect(preview).toHaveClass(/is-visible/);
  await page.mouse.move(-10, -10);
  await expect(preview).not.toHaveClass(/is-visible/);
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(1100);
  await expect(preview).not.toHaveClass(/is-visible/);
});
