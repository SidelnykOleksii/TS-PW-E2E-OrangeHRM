import { Locator } from "@playwright/test";
import { ComponentHolder } from "./abstractClasses";

export class LeftSideMenuComponent extends ComponentHolder {
  private leftSideMenuSearchField = this.page.getByPlaceholder("Search");

  leftSideMenuItem(name: string): Locator {
    return this.page.getByRole("link", { name });
  }

  async clickLeftSideMenuItem(name: string) {
    await this.leftSideMenuItem(name).click();
  }
}
