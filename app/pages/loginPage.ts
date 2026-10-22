import { expect } from "@playwright/test";
import { BasePage } from "./basePage";

export class LoginPage extends BasePage {
  private usernameInput = this.page.getByPlaceholder("Username");
  private passwordInput = this.page.getByPlaceholder("Password");
  private loginButton = this.page.getByRole("button", { name: "Login" });
  private errorMessage = this.page.locator(".oxd-alert-content-text");

  async enterUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async fillLoginForm(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    await this.waitForPageLoad();
  }

  async assertLoginErrorMessageIsVisible() {
    // The demo server can be slow to run validation and render the banner;
    // give it more room than the default 5s before declaring it missing.
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
    await expect(this.errorMessage).toHaveText("Invalid credentials");
  }
}
