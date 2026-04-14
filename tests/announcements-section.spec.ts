import { expect, test } from "@playwright/test";

test("homepage announcements section shows seeded announcements", async ({ page }) => {
  const stamp = process.env.SEED_STAMP;
  test.skip(!stamp, "SEED_STAMP env var is required.");

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Latest Announcements" })).toBeVisible();
  for (const suffix of ["1", "2", "3", "4", "5"]) {
    await expect(page.locator("body")).toContainText(`E2E Ann ${stamp}-${suffix}`);
  }
});
