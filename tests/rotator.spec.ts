import { test, expect } from "@playwright/test";

test("rotator changes image and text without navigation, supports drag and keyboard, and exposes repositories", async ({ page }, info) => {
  await page.goto("/projects/sentri");
  await page.evaluate(() => { (window as Window & { rotatorMarker?: string }).rotatorMarker = "same document"; });
  const carousel = page.getByRole("region", { name: "SENTRI project visuals" });
  const image = carousel.locator("img");
  const first = await image.getAttribute("src");
  await page.getByRole("button", { name: "Next slide" }).click();
  await expect(carousel.getByRole("heading")).toHaveText("Protocol — Gmail continuation training");
  await expect(image).not.toHaveAttribute("src", first!);
  await expect(carousel.getByText("Slide 2 of 5")).toBeVisible();
  await expect(carousel.locator(".rotator-track span")).toHaveAttribute("style", /translateX\(100%\)/);
  const stage = carousel.locator(".rotator-image");
  await stage.focus();
  await page.keyboard.press("ArrowRight");
  await expect(carousel.getByRole("heading")).toHaveText("Deployment — admin panel");
  if (info.project.name === "mobile") {
    await stage.scrollIntoViewIfNeeded();
    const box = await stage.boundingBox();
    const session = await page.context().newCDPSession(page);
    const point = { x: box!.x + box!.width * 0.7, y: box!.y + box!.height / 2 };
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [point] });
    for (let step = 1; step <= 5; step++) {
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: point.x - step * 20, y: point.y }] });
    }
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await session.detach();
  } else {
    const box = await stage.boundingBox();
    await page.mouse.move(box!.x + box!.width * 0.7, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width * 0.3, box!.y + box!.height / 2, { steps: 5 });
    await page.mouse.up();
  }
  await expect(carousel.getByRole("heading")).toHaveText("Deployment — company setup");
  await page.getByRole("button", { name: "Previous slide" }).click();
  await expect(carousel.getByText("Slide 3 of 5")).toBeVisible();
  expect(await page.evaluate(() => (window as Window & { rotatorMarker?: string }).rotatorMarker)).toBe("same document");
  await expect(page).toHaveURL(/\/projects\/sentri$/);
  const repo = page.getByRole("link", { name: "View SENTRI on GitHub" });
  await expect(repo).toHaveAttribute("href", "https://github.com/ElKahfi/Sentricol");
  await expect(repo).toHaveAttribute("target", "_blank");
  await expect(repo).toHaveAttribute("rel", "noopener noreferrer");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const trackBounds = await carousel.locator(".rotator-track").boundingBox();
  const imageBounds = await stage.boundingBox();
  const captionBounds = await carousel.locator(".rotator-caption").boundingBox();
  expect(trackBounds!.y + trackBounds!.height).toBeLessThan(imageBounds!.y);
  expect(captionBounds!.y).toBeGreaterThanOrEqual(imageBounds!.y + imageBounds!.height);
  expect(Math.abs(captionBounds!.x + captionBounds!.width / 2 - imageBounds!.x - imageBounds!.width / 2)).toBeLessThan(2);
  await expect(carousel.getByRole("link", { name: "View full-size image" })).toHaveCount(0);
  await page.screenshot({ path: info.outputPath("rotator.png"), fullPage: true });
  for (const [slug, title] of [["communimate", "Communimate"], ["mojo", "Mojo"]]) {
    await page.goto(`/projects/${slug}`);
    await page.getByRole("button", { name: "Next slide" }).click();
    await expect(page.getByText(`Slide 2 of ${slug === "mojo" ? 5 : 2}`)).toBeVisible();
    const link = page.getByRole("link", { name: `View ${title} on GitHub` });
    if (slug === "mojo") await expect(link).toHaveCount(0);
    else await expect(link).toHaveAttribute("href", "https://github.com/ElKahfi/Communimate");
  }
});
