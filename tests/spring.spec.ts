import { test, expect, type Page } from "@playwright/test";

test.use({ launchOptions: { ignoreDefaultArgs: ["--hide-scrollbars"] } });

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Mouse-wheel visual follower");
  await page.goto("/");
  await expect(page.locator(".spring-curtains")).toHaveCount(1);
  // Keep wheel input inside the page so the passive wheel listener receives it.
  // This point remains over the stationary hero during all sampled transitions.
  await page.mouse.move(100, 100);
  await page.evaluate(() => scrollTo({ top: 200, behavior: "instant" }));
  await expect.poll(() => visualPosition(page)).toBe(200);
});

const visualPosition = (page: Page) => page.locator("#work .screen").evaluate((el) => innerHeight - el.getBoundingClientRect().top);

// Observe the actual painted panel and image geometry on successive browser frames,
// rather than testing the spring implementation or its private tuning constants.
const sample = (page: Page, duration = 700) => page.evaluate((duration) => new Promise<Array<{ time: number; native: number; visual: number; image: number }>>((resolve) => {
  const samples: Array<{ time: number; native: number; visual: number; image: number }> = [];
  const start = performance.now();
  const frame = () => {
    samples.push({
      time: performance.now() - start,
      native: scrollY,
      visual: innerHeight - document.querySelector("#work .screen")!.getBoundingClientRect().top,
      image: document.querySelector("#work .project-art")!.getBoundingClientRect().top,
    });
    if (performance.now() - start < duration) requestAnimationFrame(frame);
    else resolve(samples);
  };
  requestAnimationFrame(frame);
}), duration);

for (const delta of [120, 450]) {
  test(`a ${delta}px wheel step glides monotonically, settles quickly, and preserves slower artwork travel`, async ({ page }, testInfo) => {
    const samplesPromise = sample(page);
    await page.mouse.wheel(0, delta);
    const samples = await samplesPromise;
    await testInfo.attach("wheel-frame-samples", { body: JSON.stringify(samples), contentType: "application/json" });
    const end = 200 + delta;
    expect(samples.at(-1)!.native).toBe(end);
    const afterInput = samples.filter((s) => s.native === end);
    expect(afterInput.some((s) => s.visual > 201 && s.visual < end - 1)).toBe(true);
    for (let i = 1; i < afterInput.length; i++) {
      expect(afterInput[i].visual).toBeGreaterThanOrEqual(afterInput[i - 1].visual - 0.05);
      expect(afterInput[i].visual).toBeLessThanOrEqual(end + 0.05);
    }
    const settled = afterInput.find((s) => Math.abs(s.visual - end) < 0.2);
    expect(settled).toBeDefined();
    expect(settled!.time - afterInput[0].time).toBeLessThan(450);
    expect(afterInput.filter((s) => s.time > settled!.time).every((s) => Math.abs(s.visual - end) < 0.2)).toBe(true);
    const first = afterInput[0];
    const last = afterInput.at(-1)!;
    const imageTravel = Math.abs(last.image - first.image);
    const panelTravel = last.visual - first.visual;
    expect(imageTravel / panelTravel).toBeGreaterThan(0.2);
    expect(imageTravel / panelTravel).toBeLessThan(0.3);
  });
}

test("repeated wheel input and a quick reversal do not bounce or queue long movement", async ({ page }, testInfo) => {
  const samplesPromise = sample(page, 1000);
  await page.mouse.wheel(0, 120);
  await page.mouse.wheel(0, 120);
  await page.mouse.wheel(0, 120);
  await page.waitForTimeout(90);
  await page.mouse.wheel(0, -300);
  const samples = await samplesPromise;
  await testInfo.attach("reverse-frame-samples", { body: JSON.stringify(samples), contentType: "application/json" });
  expect(samples.at(-1)!.native).toBe(260);
  expect(samples.at(-1)!.visual).toBeCloseTo(260, 1);
  expect(samples.every((s) => s.visual >= 199.9 && s.visual <= 560.1)).toBe(true);
  const reversed = samples.filter((s) => s.native === 260);
  expect(reversed.some((s) => s.visual > 280)).toBe(true);
  for (let i = 1; i < reversed.length; i++) {
    expect(reversed[i].visual).toBeLessThanOrEqual(reversed[i - 1].visual + 0.1);
  }
  expect(reversed.find((s) => Math.abs(s.visual - 260) < 0.2)!.time - reversed[0].time).toBeLessThan(450);
});

test("frequent small pixel inputs remain responsive without accumulating inertia", async ({ page }, testInfo) => {
  const samplesPromise = sample(page, 2000);
  for (let i = 0; i < 16; i++) {
    await page.mouse.wheel(0, 8);
    await page.waitForTimeout(12);
  }
  const samples = await samplesPromise;
  expect(samples.at(-1)!.native).toBe(328);
  expect(samples.at(-1)!.visual).toBeCloseTo(328, 1);
  expect(Math.max(...samples.map((s) => s.native - s.visual))).toBeLessThan(35);
  expect(samples.every((s) => s.visual <= s.native + 0.1)).toBe(true);
  const finalInput = samples.filter((s) => s.native === 328);
  expect(finalInput.find((s) => Math.abs(s.visual - 328) < 0.2)!.time - finalInput[0].time).toBeLessThan(250);
  await testInfo.attach("fine-input-frame-samples", { body: JSON.stringify(samples), contentType: "application/json" });
});

test("keyboard navigation interrupts catch-up and offscreen artwork relinquishes promotion", async ({ page }) => {
  await page.mouse.wheel(0, 450);
  await page.keyboard.press("Home");
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect.poll(() => visualPosition(page)).toBe(0);
  await page.waitForTimeout(550);
  expect(await visualPosition(page)).toBe(0);
  await page.evaluate(() => scrollTo({ top: 1800, behavior: "instant" }));
  await expect.poll(() => page.locator("#communimate .screen").evaluate((el) => el.getBoundingClientRect().top)).toBe(0);
  await expect(page.locator("#work .project-art")).toHaveCSS("will-change", "auto");
  await expect(page.locator("#mojo .project-art")).toHaveCSS("will-change", "auto");
  await page.mouse.move(1300, 100);
  await expect.poll(() => page.locator("#communimate .project-art").evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m11)).toBeGreaterThan(1.019);
  const link = page.locator("#communimate .panel-hit-area");
  expect((await link.boundingBox())!.y).toBe(0);
  await expect(link).toHaveCSS("transform", "none");
});

test("the last curtain still glides when wheel input crosses into the footer", async ({ page }) => {
  await page.evaluate(() => scrollTo({ top: 2300, behavior: "instant" }));
  const panel = page.locator("#mojo .screen");
  await expect.poll(() => panel.evaluate((el) => el.getBoundingClientRect().top)).toBe(400);
  const samplesPromise = page.evaluate(() => new Promise<number[]>((resolve) => {
    const samples: number[] = [];
    const start = performance.now();
    const frame = () => {
      samples.push(document.querySelector("#mojo .screen")!.getBoundingClientRect().top);
      if (performance.now() - start < 700) requestAnimationFrame(frame);
      else resolve(samples);
    };
    requestAnimationFrame(frame);
  }));
  await page.mouse.wheel(0, 450);
  const samples = await samplesPromise;
  expect(samples.some((y) => y > 0 && y < 390)).toBe(true);
  for (let i = 1; i < samples.length; i++) {
    expect(samples[i]).toBeLessThanOrEqual(samples[i - 1] + 0.1);
    expect(samples[i]).toBeGreaterThanOrEqual(-50.1);
  }
  expect(samples.at(-1)).toBe(-50);
  expect(await page.locator("#about").evaluate((el) => el.getBoundingClientRect().top)).toBe(850);
  expect(await page.evaluate(() => document.elementFromPoint(700, 500)?.closest(".curtain-slot")?.id)).toBe("mojo");
});

test("changing motion preference during a wheel glide cancels residual motion", async ({ page }) => {
  await page.mouse.wheel(0, 450);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(650);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".spring-curtains")).toHaveCount(0);
  await expect.poll(() => page.locator(".hero").evaluate((el) => el.getBoundingClientRect().top)).toBe(-650);
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => scrollY)).toBe(650);
  for (const surface of await page.locator(".curtain-surface").all()) {
    await expect(surface).toHaveCSS("transform", "none");
    await expect(surface).toHaveCSS("will-change", "auto");
  }
});

test("native scrollbar dragging and PageDown retain accurate destinations", async ({ page }) => {
  // Keep the native scrollbar visible in this test even on macOS overlay settings.
  await page.addStyleTag({ content: "html { overflow-y: scroll; } ::-webkit-scrollbar { width: 16px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #aaa; }" });
  const geometry = await page.evaluate(() => ({
    x: innerWidth - 8,
    y: (scrollY + innerHeight / 2) * innerHeight / document.documentElement.scrollHeight,
    destination: scrollY + 100 * document.documentElement.scrollHeight / innerHeight,
  }));
  await page.mouse.move(geometry.x, geometry.y);
  await page.mouse.down();
  await page.mouse.move(geometry.x, geometry.y + 100, { steps: 8 });
  await page.mouse.up();
  // Chromium may deliver the final drag scroll after mouseup resolves.
  await expect.poll(() => page.evaluate((destination) => Math.abs(scrollY - destination), geometry.destination)).toBeLessThan(3);
  const position = await page.evaluate(() => scrollY);
  expect(position).toBeGreaterThan(400);
  expect(position).toBeLessThan(900);
  await expect.poll(() => visualPosition(page)).toBeCloseTo(position, 0);
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => scrollY)).toBe(position);
  await page.keyboard.press("PageDown");
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(1000);
  await expect.poll(() => page.locator("#communimate .screen").evaluate((el) => Math.abs(el.getBoundingClientRect().top - (1800 - scrollY)))).toBeLessThan(1);
});
