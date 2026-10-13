import { test, expect } from "@playwright/test";

test("Sentri preview plays a silent short clip and reduced motion keeps its poster", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Touch uses inline summaries");
  await page.goto("/#work");
  await expect.poll(() => page.locator("#work").evaluate((el) => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
  await page.mouse.move(800, 400, { steps: 5 });
  const preview = page.locator(".project-preview");
  await expect(preview).toHaveClass(/is-visible/);
  await expect(preview.getByText("SENTRI", { exact: true })).toBeVisible();
  const video = preview.locator("video");
  if (testInfo.project.name === "reduced-motion") {
    await expect(video).not.toHaveAttribute("src", /mp4/);
    await expect(video).toBeHidden();
    await expect(preview.locator("img")).toBeVisible();
  } else {
    await expect.poll(() => video.evaluate((el) => (el as HTMLVideoElement).currentTime)).toBeGreaterThan(0.1);
    expect(await video.evaluate((el) => (el as HTMLVideoElement).muted)).toBe(true);
    expect(await video.evaluate((el) => (el as HTMLVideoElement).duration)).toBeLessThanOrEqual(8.1);
    await page.screenshot({ path: testInfo.outputPath("sentri-video-preview.png") });
    await page.mouse.move(-10, -10);
    await expect(preview).not.toHaveClass(/is-visible/);
    await expect(video).toHaveCount(0);
  }
});

test("failed preview video leaves a usable poster and clickable project", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Video error fallback on desktop");
  await page.route("**/media/sentri-preview.mp4", (route) => route.abort());
  await page.goto("/#work");
  await expect.poll(() => page.locator("#work").evaluate((el) => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
  await page.mouse.move(800, 400, { steps: 5 });
  await expect(page.locator(".project-preview")).toHaveClass(/is-visible/);
  await expect(page.locator(".project-preview video")).not.toHaveClass(/is-playing/);
  await expect.poll(() => page.locator(".project-preview img").evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await page.mouse.click(800, 400);
  await expect(page).toHaveURL(/\/projects\/sentri$/);
});

test("old project URLs still resolve to the named projects", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Route aliases do not vary by device");
  for (const [old, slug] of [["project-01", "sentri"], ["project-02", "communimate"], ["project-03", "mojo"]]) {
    await page.goto(`/projects/${old}`);
    await expect(page).toHaveURL(new RegExp(`/projects/${slug}$`));
  }
});

test("menu opens by hover or tap, closes after selection, and supports keyboard dismissal", async ({ page, isMobile }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Navigation menu" });
  const menu = page.getByRole("navigation", { name: "Main navigation" });
  await expect(menu).toBeHidden();
  if (isMobile) {
    await trigger.tap();
    await expect(menu).toBeVisible();
    await trigger.tap();
    await expect(menu).toBeHidden();
    await trigger.tap();
  } else {
    await trigger.hover();
    await expect(menu).toBeVisible();
    await page.getByRole("link", { name: "Work", exact: true }).hover();
    await expect(menu).toBeVisible();
    await page.mouse.move(50, 200);
    await expect(menu).toBeHidden();
    // A first physical click must not hit a link exposed by hover, or close the menu.
    const restingButton = await trigger.boundingBox();
    await page.mouse.click(restingButton!.x + restingButton!.width / 2, restingButton!.y + restingButton!.height / 2);
    await expect(menu).toBeVisible();
    expect(await trigger.boundingBox()).toEqual(restingButton);
    await trigger.click();
    await expect(menu).toBeHidden();
    await page.mouse.move(50, 200);
    await page.reload();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(trigger).toBeFocused();
    await expect(menu).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Intro", exact: true })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(menu).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(menu).toBeHidden();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "View SENTRI", exact: true })).toBeFocused();
    await trigger.hover();
  }
  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.getByRole("heading", { name: "About Me", exact: true })).toBeInViewport();
});

test("each curtain covers a stationary panel at start, midpoint and end, in both directions", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Touch and reduced motion use ordinary flow");
  await page.goto("/");
  await expect(page.locator(".spring-curtains")).toHaveCount(1);
  const height = await page.evaluate(() => innerHeight);
  const panels = page.locator(".screen");
  const top = async (index: number) => panels.nth(index).evaluate((el) => el.getBoundingClientRect().top);
  for (const [index, reverse] of [[0, false], [1, false], [2, false], [2, true], [1, true], [0, true]] as const) {
    for (const progress of reverse ? [1, 0.5, 0] : [0, 0.5, 1]) {
      await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), (index + progress) * height);
      await expect.poll(async () => Math.abs(await top(index + 1) - height * (1 - progress))).toBeLessThan(3);
      if (progress < 1) await expect.poll(async () => Math.abs(await top(index))).toBeLessThan(3);
      if (progress === 0.5) {
        const layers = await page.evaluate(() => [0.25, 0.75].map((fraction) => document.elementFromPoint(innerWidth / 2, innerHeight * fraction)?.closest(".curtain-slot")?.id));
        expect(layers).toEqual([["top", "work", "communimate"][index], ["work", "communimate", "mojo"][index]]);
        if (testInfo.project.name === "desktop") await page.screenshot({ path: testInfo.outputPath(`curtain-${index}-midpoint.png`) });
      }
    }
  }
});

test("browser back restores a project reached without a hash", async ({ page }, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name === "desktop") await expect(page.locator(".spring-curtains")).toHaveCount(1);
  const trigger = page.getByRole("button", { name: "Navigation menu" });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await trigger.click();
  await page.evaluate(() => scrollTo({ top: innerHeight * 2, behavior: "instant" }));
  await expect.poll(() => page.locator("#communimate").evaluate((el) => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
  await page.getByRole("link", { name: "View Communimate", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/communimate$/);
  await expect(page.locator(".detail-heading h1")).toHaveText("Communimate");
  await page.goBack();
  await expect(page).toHaveURL(/\/#communimate$/);
  await expect.poll(() => page.locator("#communimate").evaluate((el) => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
});

test("browser back restores hash navigation and resizing keeps anchor positions correct", async ({ page }) => {
  await page.goto("/#mojo");
  await expect.poll(() => page.locator("#mojo").evaluate((el) => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
  await page.getByRole("link", { name: "View Mojo", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/mojo$/);
  await expect(page.locator(".detail-heading h1")).toHaveText("Mojo");
  await page.goBack();
  await expect(page).toHaveURL(/\/#mojo$/);
  await expect.poll(() => page.locator("#mojo").evaluate((el) => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
  await page.setViewportSize({ width: 820, height: 650 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto("/#work");
  await expect.poll(() => page.locator("#work").evaluate((el) => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("changing reduced-motion preference removes pinning and reveals a readable static layout", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Live preference change on desktop");
  await page.goto("/");
  await expect(page.locator(".spring-curtains")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".spring-curtains")).toHaveCount(0);
  await expect(page.locator(".hero-lit .hero-name")).toHaveCSS("transform", "none");
  await page.evaluate(() => scrollTo({ top: 450, behavior: "instant" }));
  await expect.poll(() => page.locator(".hero").evaluate((el) => el.getBoundingClientRect().top)).toBe(-450);
  await expect(page.locator("#work .panel-summary")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".spring-curtains")).toHaveCount(1);
});

test("home renders, images load, and layout stays within viewport", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "ELKAHFI", exact: true })).toBeVisible();
  await expect(page.locator(".hero > .hero-heading .hero-tagline")).toHaveText("System Design");
  await expect(page.locator(".hero > .hero-heading")).toHaveText("ELKAHFISystem Design");
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeHidden();
  await expect(page.locator(".project-panel")).toHaveCount(3);
  await expect(page.locator(".panel-top, .panel-bottom, .placeholder-label")).toHaveCount(0);
  if (testInfo.project.name === "desktop") await expect(page.locator("#work .panel-summary")).toBeHidden();
  await expect.poll(() => page.locator(".hero-city img").evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("home.png") });
  for (const id of ["work", "communimate", "mojo"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator(`#${id} img`).evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await page.screenshot({ path: testInfo.outputPath(`${id}.png`) });
  }
  expect(errors).toEqual([]);
});

test("project links, detail content, next project, and return navigation work", async ({ page, isMobile }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Navigation menu" });
  if (isMobile) await trigger.tap();
  else await trigger.hover();
  await page.getByRole("link", { name: "Work", exact: true }).click();
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeHidden();
  await expect.poll(() => page.locator("#work").evaluate((el) => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
  await page.getByRole("link", { name: "View SENTRI", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/sentri$/);
  await expect(page.getByRole("heading", { name: "SENTRI", exact: true })).toBeVisible();
  await expect(page.getByText("2026", { exact: true })).toBeVisible();
  await expect(page.getByText("To be added", { exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: "Next project Communimate" }).click();
  await expect(page).toHaveURL(/\/projects\/communimate$/);
  await page.getByRole("link", { name: "All projects" }).click();
  await expect(page).toHaveURL(/\/#communimate$/);
  await expect.poll(() => page.locator("#communimate").evaluate((el) => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
});

test("all detail routes and missing-project handling work", async ({ page }) => {
  for (const [slug, title] of [["sentri", "SENTRI"], ["communimate", "Communimate"], ["mojo", "Mojo"]]) {
    const response = await page.goto(`/projects/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  const response = await page.goto("/projects/missing-project");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "A missing connection." })).toBeVisible();
});

test("keyboard users can skip navigation and open a project", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop keyboard interaction");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "View SENTRI", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/projects\/sentri$/);
});

test("spotlight follows pointer only with fine pointer and motion enabled", async ({ page }, testInfo) => {
  await page.goto("/");
  const shade = page.locator(".hero");
  if (testInfo.project.name === "desktop") await expect(page.locator(".spring-curtains")).toHaveCount(1);
  await page.mouse.move(250, 220, { steps: 5 });
  if (testInfo.project.name === "desktop") {
    await expect.poll(() => shade.evaluate((el) => parseFloat((el as HTMLElement).style.getPropertyValue("--light-x")))).toBeGreaterThan(200);
    const layoutSize = await page.locator("#hero-title").evaluate((el) => [(el as HTMLElement).offsetWidth, (el as HTMLElement).offsetHeight]);
    await page.mouse.move(600, 350);
    await expect.poll(() => shade.evaluate((el) => Math.abs(parseFloat((el as HTMLElement).style.getPropertyValue("--light-x")) - 600))).toBeLessThan(2);
    expect(await page.locator("#hero-title").evaluate((el) => [(el as HTMLElement).offsetWidth, (el as HTMLElement).offsetHeight])).toEqual(layoutSize);
    await page.screenshot({ path: testInfo.outputPath("illuminated-type.png") });
  } else {
    await expect(shade).not.toHaveAttribute("style", /--light-x/);
    await expect(page.locator(".hero-lit .hero-name")).toHaveCSS("transform", testInfo.project.name === "reduced-motion" ? "none" : "matrix(1, 0, 0, 1, 0, -1)");
  }
});

test("preview is clamped, dismisses, and never intercepts project clicks", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Touch uses inline descriptions");
  await page.goto("/#work");
  await expect.poll(() => page.locator("#work").evaluate((el) => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
  await page.mouse.move(1400, 875);
  const preview = page.locator(".project-preview");
  await expect(preview).toHaveClass(/is-visible/);
  await expect(preview).toHaveCSS("pointer-events", "none");
  const box = await preview.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(1440);
  expect(box!.y + box!.height).toBeLessThanOrEqual(900);
  await page.screenshot({ path: testInfo.outputPath("hover-preview.png") });
  await page.keyboard.press("Escape");
  await expect(preview).not.toHaveClass(/is-visible/);
  await page.mouse.move(800, 400);
  await expect(preview).toHaveClass(/is-visible/);
  await page.mouse.click(800, 400);
  await expect(page).toHaveURL(/\/projects\/sentri$/);
});

test("touch summaries and links are always visible", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Touch behavior");
  await page.goto("/#work");
  await expect(page.locator("#work .panel-summary")).toBeVisible();
  await expect(page.getByRole("link", { name: "View SENTRI", exact: true })).toBeVisible();
  await expect(page.locator(".project-preview")).toBeHidden();
  await page.getByRole("link", { name: "View SENTRI", exact: true }).tap();
  await expect(page).toHaveURL(/\/projects\/sentri$/);
});

test("scroll settles near panels and reverses; reduced motion stays unanimated", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Native touch scrolling is checked through mobile navigation");
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  if (testInfo.project.name === "reduced-motion") {
    await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
    await page.mouse.wheel(0, 850);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(700);
    await expect(page.locator("#work .project-art")).not.toHaveAttribute("style", /transform/);
    const initial = await page.evaluate(() => scrollY);
    // Wait through the settling window to prove no snapping starts.
    await page.waitForTimeout(1100);
    expect(await page.evaluate(() => scrollY)).toBe(initial);
  } else {
    await expect(page.locator(".spring-curtains")).toHaveCount(1);
    // Mid-transition input must not be pulled toward a distant slide boundary.
    await page.mouse.wheel(0, 450);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(450);
    await page.waitForTimeout(700);
    expect(await page.evaluate(() => scrollY)).toBe(450);
    await page.mouse.wheel(0, -450);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await page.mouse.wheel(0, 850);
    await expect.poll(() => page.evaluate(() => Math.abs(scrollY - 900))).toBeLessThan(3);
    await page.mouse.wheel(0, 850);
    await expect.poll(() => page.evaluate(() => Math.abs(scrollY - 1800))).toBeLessThan(3);
    await page.mouse.wheel(0, -850);
    await expect.poll(() => page.evaluate(() => Math.abs(scrollY - 900))).toBeLessThan(3);
  }
  expect(errors).toEqual([]);
});
