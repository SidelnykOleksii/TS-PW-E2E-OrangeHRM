import { test, expect } from "@playwright/test";
import { LoginPage } from "../app/pages/loginPage";
import { USERNAME, PASSWORD } from "../utils/credentials";

test.describe("Login Functionality", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto("/auth/login");
  });

  test("Should allow a user to login with valid credentials", async ({
    page,
  }) => {
    await loginPage.login(USERNAME, PASSWORD);
    await expect(page).toHaveURL(/.*dashboard\/index/);
    await expect(
      page.locator("h6.oxd-text").filter({ hasText: "Dashboard" })
    ).toBeVisible();
  });

  test("Should display an error message with invalid credentials", async ({
    page,
  }) => {
    await loginPage.login("invalidUser", "invalidPass");
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText("Invalid credentials");
    await expect(page).toHaveURL(/.*auth\/login/);
  });
});
