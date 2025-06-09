import { Page, Locator } from "@playwright/test";

export class LeftSideMenuComponent {
  private page: Page;

  readonly leftSideMenuSearchField: Locator;

  constructor(page: Page) {
    this.page = page;
    this.leftSideMenuSearchField = this.page.getByPlaceholder("Search");
  }

  leftSideMenuItem(name: string): Locator {
    return this.page.getByRole("link", { name });
  }

  async clickLeftSideMenuItem(name: string) {
    await this.leftSideMenuItem(name).click();
  }
}
