import { test, expect } from "@playwright/test";

test("compact personal heading leads into slides and the full-screen university button opens its collection", async ({ page }, info) => {
  await page.goto("/#projects");
  await expect(page.getByRole("heading", { name: "Projects (Personal / Team)", exact: true })).toBeInViewport();
  expect(await page.locator(".curtain-slot").evaluateAll(slots => slots.map(slot => slot.id))).toEqual(["top", "projects", "work", "communimate", "mojo", "university"]);
  const personal = page.locator("#projects");
  const compactHeight = await personal.evaluate(el => el.getBoundingClientRect().height);
  expect(compactHeight).toBeLessThan((await page.evaluate(() => innerHeight)) * 0.5);
  await expect(personal.locator("p, a")).toHaveCount(0);
  expect(await page.locator("#work").evaluate(el => (el as HTMLElement).offsetTop - document.querySelector<HTMLElement>("#projects")!.offsetTop)).toBeCloseTo(compactHeight, 0);
  await page.screenshot({ path: info.outputPath("personal-heading.png") });
  await page.getByRole("button", { name: "Navigation menu" }).click();
  await page.getByRole("link", { name: "University", exact: true }).click();
  await expect(page.getByRole("heading", { name: "University Projects", exact: true })).toBeInViewport();
  const university = page.locator("#university");
  expect(await university.evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual((await page.evaluate(() => innerHeight)) - 1);
  await expect(university.locator("p, .section-kicker, .section-bottom")).toHaveCount(0);
  const button = page.getByRole("link", { name: "Explore University Projects" });
  const titleBox = (await university.getByRole("heading").boundingBox())!;
  const buttonBox = (await button.boundingBox())!;
  expect(buttonBox.y).toBeGreaterThan(titleBox.y + titleBox.height);
  expect(Math.abs(buttonBox.x + buttonBox.width / 2 - titleBox.x - titleBox.width / 2)).toBeLessThan(2);
  await page.screenshot({ path: info.outputPath("university-intro.png") });
  await button.click();
  await expect(page).toHaveURL(/\/university-projects$/);
  await page.getByRole("link", { name: "Back to portfolio" }).click();
  await expect(page).toHaveURL(/\/#university$/);
  await expect(page.getByRole("heading", { name: "University Projects", exact: true })).toBeInViewport();
});

test("short and narrow viewports keep the two introductions readable", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "Viewport geometry is independent of input profile");
  for (const viewport of [{ width: 1440, height: 520 }, { width: 375, height: 520 }, { width: 320, height: 568 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/#projects");
    await expect(page.locator("#projects h2")).toBeInViewport();
    expect(await page.locator("#projects").evaluate(el => el.getBoundingClientRect().height)).toBeLessThan(viewport.height / 2);
    await page.goto("/#university");
    const heading = page.locator("#university h2");
    const button = page.getByRole("link", { name: "Explore University Projects" });
    await expect(heading).toBeInViewport();
    await expect(button).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("university selection changes the entire project and supports buttons, keyboard, and swipe", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/university-projects");
  const article = page.locator("#university-project");
  const image = article.locator("img");
  for (const [name, slug, tools, linkCount, phrase] of [
    ["Copyin", "copyin", "Figma, draw.io", 3, "Print and stationery, together"],
    ["TukaKu", "tukaku", "Figma, Canva", 2, "Finding the right help"],
    ["Batikeryday", "batikeryday", "CLO, Canva", 1, "Batik for everyday wear"],
  ] as const) {
    await page.getByRole("button", { name: new RegExp(name) }).click();
    await expect(article).toHaveAttribute("data-project", slug);
    await expect(article.getByRole("heading", { level: 2 })).toHaveText(name);
    await expect(image).toHaveAttribute("src", new RegExp(`${slug}.webp`));
    await expect.poll(() => image.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(article.locator("dd")).toHaveText(["Team Leader", tools]);
    await expect(article.getByRole("heading", { name: phrase })).toBeVisible();
    await expect(article.locator(".university-links a")).toHaveCount(linkCount);
    for (const link of await article.locator(".university-links a").all()) {
      await expect(link).toHaveAttribute("href", /^https:\/\//);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    await expect(page.getByRole("button", { name: new RegExp(name) })).toHaveAttribute("aria-pressed", "true");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.getByRole("button", { name: "Next project" }).click();
  await expect(article).toHaveAttribute("data-project", "copyin");
  await page.getByRole("button", { name: "Previous project" }).click();
  await expect(article).toHaveAttribute("data-project", "batikeryday");
  const stage = article.locator(".rotator-image");
  await stage.focus();
  await page.keyboard.press("ArrowRight");
  await expect(article).toHaveAttribute("data-project", "copyin");
  await stage.scrollIntoViewIfNeeded();
  const box = (await stage.boundingBox())!;
  const point = { x: box.x + box.width * 0.7, y: box.y + box.height / 2 };
  if (info.project.name === "mobile") {
    const session = await page.context().newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [point] });
    for (let step = 1; step <= 5; step++) await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: point.x - step * 20, y: point.y }] });
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await session.detach();
  } else {
    await page.mouse.move(point.x, point.y);
    await page.mouse.down();
    await page.mouse.move(point.x - 120, point.y, { steps: 5 });
    await page.mouse.up();
  }
  await expect(article).toHaveAttribute("data-project", "tukaku");
  await expect(page.getByText("Project 2 of 3 — TukaKu", { exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath("university-projects.png"), fullPage: true });
  expect(errors).toEqual([]);
});
