import { expect, test } from "@playwright/test";

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD;

test("announcement created in admin is visible on home banner", async ({ page }) => {
  test.skip(!adminEmail || !adminPassword, "Admin credentials are required.");

  const stamp = Date.now().toString();
  const title = `E2E Announcement ${stamp}`;
  const content = `Visible on home ${stamp}`;
  const today = new Date().toISOString().slice(0, 10);

  await page.goto("/admin/login");
  await page.getByPlaceholder("admin@school.edu").fill(adminEmail as string);
  await page.locator('input[type="password"]').fill(adminPassword as string);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  await page.locator('aside a[href="/admin/announcements"]').first().click();
  await expect(page).toHaveURL(/\/admin\/announcements$/);

  await page.locator('input[name="title"]').fill(title);
  await page.locator('input[name="date"]').fill(today);
  await page.locator('textarea[name="content"]').fill(content);
  await page.locator('input[name="sort_order"]').fill("0");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Announcement created.")).toBeVisible();

  await page.goto("/");
  await expect(page.locator("body")).toContainText(title);
  await expect(page.locator("body")).toContainText(content);
});
