import { test, expect, type Locator } from "@playwright/test";

const transform = (locator: Locator) => locator.evaluate((element) => {
  const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
  return { x: matrix.m41, y: matrix.m42, scale: matrix.m11 };
});

test("hero moves toward the cursor while text illumination stays aligned and controls stay fixed", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Fine-pointer motion");
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(3);
  const city = page.locator(".hero-city");
  const heading = page.locator(".hero > .hero-heading");
  const trigger = page.getByRole("button", { name: "Navigation menu" });
  const triggerBounds = await trigger.boundingBox();
  await page.mouse.move(1300, 100);
  await expect.poll(async () => (await transform(city)).scale).toBeGreaterThan(1.019);
  await expect.poll(async () => (await transform(city)).x).toBeGreaterThan(5);
  expect((await transform(city)).y).toBeLessThan(-3);
  expect((await transform(city)).scale).toBeLessThanOrEqual(1.021);
  // Read both layers in one browser frame while the easing is still active.
  const textTransforms = await page.locator(".hero-heading").evaluateAll((elements) => elements.map((element) => getComputedStyle(element).transform));
  expect(textTransforms[0]).toEqual(textTransforms[1]);
  const cityBounds = await city.boundingBox();
  expect(cityBounds!.x).toBeLessThanOrEqual(0);
  expect(cityBounds!.y).toBeLessThanOrEqual(0);
  expect(cityBounds!.x + cityBounds!.width).toBeGreaterThanOrEqual(1440);
  expect(cityBounds!.y + cityBounds!.height).toBeGreaterThanOrEqual(900);
  expect(await trigger.boundingBox()).toEqual(triggerBounds);
  await page.screenshot({ path: testInfo.outputPath("hero-motion.png") });
  await page.mouse.move(-10, -10);
  await expect.poll(() => transform(heading)).toEqual({ x: 0, y: 0, scale: 1 });
});

test("all project artwork scales and moves opposite the pointer without moving the clickable panel", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Fine-pointer motion");
  await page.goto("/#work");
  await expect(page.locator(".pin-spacer")).toHaveCount(3);
  for (const [index, id] of ["work", "communimate", "mojo"].entries()) {
    await page.mouse.move(-10, -10);
    await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), (index + 1) * 900);
    const art = page.locator(`#${id} .project-art`);
    await expect.poll(async () => Math.abs((await transform(art)).y)).toBeLessThan(0.1);
    const link = page.locator(`#${id} .panel-hit-area`);
    const bounds = await link.boundingBox();
    await page.mouse.move(1300, 100);
    await expect.poll(async () => (await transform(art)).scale).toBeGreaterThan(1.019);
    await expect.poll(async () => (await transform(art)).x).toBeLessThan(-8);
    expect((await transform(art)).y).toBeGreaterThan(5);
    await page.mouse.move(100, 800);
    await expect.poll(async () => (await transform(art)).x).toBeGreaterThan(8);
    await expect.poll(async () => (await transform(art)).y).toBeLessThan(-5);
    expect(await link.boundingBox()).toEqual(bounds);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`${id}-motion.png`) });
    await page.mouse.move(-10, -10);
    await expect.poll(() => transform(art)).toEqual({ x: 0, y: 0, scale: 1 });
  }
});

test("artwork reveal follows and reverses curtain progress with bounded settling", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Desktop scroll reveal");
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(3);
  await page.mouse.move(-10, -10);
  for (const [index, id] of ["work", "communimate", "mojo"].entries()) {
    const art = page.locator(`#${id} .project-art`);
    for (const progress of [0, 0.5, 1, 0.5, 0]) {
      await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), (index + progress) * 900);
      // At rest, artwork descends by at most 48px inside its rising panel.
      await expect.poll(async () => Math.abs((await transform(art)).y - 48 * (1 - progress))).toBeLessThan(0.5);
      const first = await transform(art);
      await page.waitForTimeout(400);
      expect(Math.abs((await transform(art)).y - first.y)).toBeLessThan(0.5);
      expect(await page.evaluate(() => scrollY)).toBe((index + progress) * 900);
    }
  }
});

test("touch and reduced motion keep static artwork and ordinary scrolling", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "desktop", "Static accessibility fallbacks");
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.mouse.move(250, 120);
  for (const selector of [".hero-city", ".hero > .hero-heading", "#work .project-art", "#communimate .project-art", "#mojo .project-art"]) {
    expect(await transform(page.locator(selector))).toEqual({ x: 0, y: 0, scale: 1 });
  }
  await page.evaluate(() => scrollTo({ top: 300, behavior: "instant" }));
  await expect.poll(() => page.locator(".hero").evaluate((el) => el.getBoundingClientRect().top)).toBe(-300);
  await page.waitForTimeout(700);
  expect(await page.evaluate(() => scrollY)).toBe(300);
});

test("live reduced-motion change clears motion and restoring it preserves project position", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Live preference change");
  await page.goto("/#work");
  await expect(page.locator(".pin-spacer")).toHaveCount(3);
  await expect.poll(() => page.locator("#work").evaluate((el) => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
  const art = page.locator("#work .project-art");
  await page.mouse.move(1300, 100);
  await expect.poll(async () => (await transform(art)).scale).toBeGreaterThan(1.01);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  expect(await transform(art)).toEqual({ x: 0, y: 0, scale: 1 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".pin-spacer")).toHaveCount(3);
  await expect.poll(() => page.locator("#work").evaluate((el) => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
  await expect.poll(async () => Math.abs((await transform(art)).y)).toBeLessThan(0.5);
});
