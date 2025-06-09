import { Page, Locator } from "@playwright/test";

export class HeaderComponent {
  private page: Page;

  readonly settingsDropdown: Locator;
  readonly upgradeButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.settingsDropdown = this.page.locator(".oxd-userdropdown-icon");
    this.upgradeButton = this.page.getByRole("button", { name: "Upgrade" });
    this.logoutLink = this.page.getByRole("menuitem", { name: "Logout" });
  }
}
