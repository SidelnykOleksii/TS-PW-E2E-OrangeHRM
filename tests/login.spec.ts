import { expect } from "@playwright/test";
import { USERNAME, PASSWORD } from "../utils/credentials";
import { test } from "../app/fixtures/base.fixture";

test.describe("Login Functionality", () => {
  test.beforeEach(async ({ pages }) => {
    await pages.loginPage.goTo("/auth/login");
  });

  test("Should allow a user to login with valid credentials", async ({
    page,
    pages,
  }) => {
    await pages.loginPage.fillLoginForm(USERNAME, PASSWORD);
    await expect(page).toHaveURL(/.*dashboard\/index/);
    await expect(
      page.locator("h6.oxd-text").filter({ hasText: "Dashboard" })
    ).toBeVisible();
  });

  test("Should display an error message with invalid credentials", async ({
    page,
    pages,
  }) => {
    await pages.loginPage.fillLoginForm("invalidUser", "invalidPass");
    await pages.loginPage.assertLoginErrorMessageIsVisible();
    await expect(page).toHaveURL(/.*auth\/login/);
  });
});
