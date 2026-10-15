import { test, expect } from "@playwright/test";

test("personal case studies share responsive metadata and capability/contribution cards", async ({ page }, info) => {
  const records = [
    ["sentri", "SENTRI", "2026", "Team Leader", "PostgreSQL, Docker, AWS EC2, Coolify"],
    ["communimate", "Communimate", "Ongoing", "Independent Project", "HTML, CSS, JavaScript"],
    ["mojo", "Mojo", "Ongoing", "System Design Infrastructure", "Next.js, React, TypeScript, Neon PostgreSQL"],
  ];
  for (const [slug, title, year, role, tools] of records) {
    await page.goto(`/projects/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.locator(".detail-heading-row .eyebrow")).toHaveText(year);
    await expect(page.locator("aside dd")).toHaveText([role, tools]);
    const cards = page.locator(".detail-story > section");
    await expect(cards.nth(0).getByRole("heading")).toHaveText("Key capabilities");
    await expect(cards.nth(1).getByRole("heading")).toHaveText("My role");
    const geometry = await page.locator(".detail-body").evaluate(el => {
      const overview = el.querySelector("aside")!.getBoundingClientRect();
      const cards = Array.from(el.querySelectorAll(".detail-story > section"), card => card.getBoundingClientRect());
      return { center: overview.x + overview.width / 2, bottom: overview.bottom,
        cards: cards.map(card => ({ y: card.y, width: card.width, height: card.height, bottom: card.bottom })),
        overflow: document.documentElement.scrollWidth > innerWidth };
    });
    expect(Math.abs(geometry.center - page.viewportSize()!.width / 2)).toBeLessThan(2);
    expect(geometry.bottom).toBeLessThan(geometry.cards[0].y);
    expect(Math.abs(geometry.cards[0].width - geometry.cards[1].width)).toBeLessThan(2);
    if (page.viewportSize()!.width >= 900) {
      expect(geometry.cards[0].y).toBe(geometry.cards[1].y);
      expect(geometry.cards[0].height).toBe(geometry.cards[1].height);
    } else expect(geometry.cards[0].bottom).toBeLessThan(geometry.cards[1].y);
    expect(geometry.overflow).toBe(false);
    await page.screenshot({ path: info.outputPath(`${slug}-details.png`), fullPage: true });
  }
  if (info.project.name === "desktop") {
    await page.setViewportSize({ width: 320, height: 568 });
    for (const [slug] of records) {
      await page.goto(`/projects/${slug}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});

test("Mojo shows five supplied images in order, accurate prototype captions, live link and working navigation", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/projects/mojo");
  const liveLink = page.getByRole("link", { name: "Visit Mojo", exact: true });
  await expect(liveLink).toHaveAttribute("href", "https://mojo-eosin.vercel.app/");
  await expect(liveLink).toHaveAttribute("target", "_blank");
  await expect(liveLink).toHaveAttribute("rel", "noopener noreferrer");
  const figure = page.locator(".rotator-slide");
  for (const [index, [title, image, phrase]] of [
    ["Mojo Chatbot", "chatbot", "chat is explicitly unavailable"],
    ["Mojo Drill", "drill", "becoming available gradually"],
    ["Kuantitatif Drill List", "kuantitatif", "still coming soon"],
    ["Drill Mode", "modes", "Personalized weakness selection remains planned"],
    ["Drill Mode Content", "practice", "refreshing starts a new session"],
  ].entries()) {
    await expect(figure.getByRole("heading")).toHaveText(title);
    await expect.poll(async () => decodeURIComponent((await figure.locator("img").getAttribute("src"))!)).toContain(`/images/mojo/${image}.webp`);
    await figure.scrollIntoViewIfNeeded();
    await expect.poll(() => figure.locator("img").evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(figure.locator("img")).toHaveAttribute("alt", /Mojo|Kuantitatif/);
    await expect(figure.getByText(`Slide ${index + 1} of 5`, { exact: true })).toBeVisible();
    await expect(figure.locator("figcaption p")).toContainText(phrase);
    await page.getByRole("button", { name: "Next slide" }).click();
  }
  await expect(figure.getByRole("heading")).toHaveText("Mojo Chatbot");
  const stage = page.locator(".rotator-image");
  await stage.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(figure.getByRole("heading")).toHaveText("Drill Mode Content");
  await page.keyboard.press("ArrowRight");
  await expect(figure.getByRole("heading")).toHaveText("Mojo Chatbot");
  if (info.project.name === "mobile") {
    await stage.scrollIntoViewIfNeeded();
    const box = (await stage.boundingBox())!;
    const point = { x: box.x + box.width * .75, y: box.y + box.height / 2 };
    const session = await page.context().newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [point] });
    for (let step = 1; step <= 5; step++) await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: point.x - step * 20, y: point.y }] });
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await session.detach();
  } else await page.keyboard.press("ArrowRight");
  await expect(figure.getByRole("heading")).toHaveText("Mojo Drill");
  await page.getByRole("link", { name: "All projects", exact: true }).click();
  await expect(page).toHaveURL(/\/#mojo$/);
  await expect.poll(() => page.locator("#mojo").evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
  await page.getByRole("link", { name: "View Mojo", exact: true }).click();
  await page.getByRole("link", { name: "Next project SENTRI" }).click();
  await expect(page).toHaveURL(/\/projects\/sentri$/);
  expect(errors).toEqual([]);
});
