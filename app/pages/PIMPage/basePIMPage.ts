import { Locator, Page } from "@playwright/test";
import { BasePage } from "../basePage";

export abstract class BasePimPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  topbarMenuTab(name: string): Locator {
    return this.page.locator("li").filter({ hasText: name });
  }

  async clickTopbarMenuTab(name: string) {
    await this.topbarMenuTab(name).click();
  }
}
