import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD;

const requireAdminCreds = () => {
  test.skip(
    !adminEmail || !adminPassword,
    "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD (or ADMIN_EMAIL/ADMIN_PASSWORD) to run admin e2e tests.",
  );
};

const loginAsAdmin = async (page: Page) => {
  await page.goto("/admin/login");
  await page.getByPlaceholder("admin@school.edu").fill(adminEmail as string);
  await page.locator('input[type="password"]').fill(adminPassword as string);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/admin$/);
};

test("admin login -> edit hero heading -> verify on public page", async ({ page }) => {
  requireAdminCreds();

  const uniqueHeading = `Hero Heading E2E ${Date.now()}`;

  await loginAsAdmin(page);
  await page.locator('aside a[href="/admin/pages/home"]').first().click();
  await expect(page).toHaveURL(/\/admin\/pages\/home$/);
  await page.locator('input[name="hero.heading"]').fill(uniqueHeading);
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Home page content saved.")).toBeVisible();

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: uniqueHeading })).toBeVisible();
});

test("contact form submission appears in admin contact submissions", async ({ page }) => {
  requireAdminCreds();
  test.setTimeout(60_000);

  const uniqueSuffix = Date.now().toString();
  const subject = `E2E Subject ${uniqueSuffix}`;
  const message = `E2E Message ${uniqueSuffix}`;

  await page.goto("/contact", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator('input[placeholder="Full Name"]')).toBeVisible({ timeout: 45_000 });
  await page.locator('input[placeholder="Full Name"]').fill("Playwright Test");
  await page.locator('input[placeholder="Email Address"]').fill("playwright@example.com");
  await page.locator('input[placeholder="Phone Number"]').fill("9999999999");
  await page.locator('input[placeholder="Subject"]').fill(subject);
  await page.locator('textarea[placeholder="Your Message"]').fill(message);
  const insertResponse = page.waitForResponse((response) => {
    return response.url().includes("/rest/v1/contact_submissions") && response.request().method() === "POST";
  });
  await page.getByRole("button", { name: "Send Message" }).click();
  await insertResponse;

  await loginAsAdmin(page);
  await page.getByRole("button", { name: "System" }).click();
  await page.getByRole("link", { name: "Contact Submissions" }).click();
  await expect(page).toHaveURL(/\/admin\/contact-submissions$/);
  await expect(async () => {
    await page.reload();
    await expect(page.locator("body")).toContainText(subject);
  }).toPass({ timeout: 20_000 });
  await expect(page.getByText(subject)).toBeVisible();
  await expect(page.getByText(message)).toBeVisible();
});
