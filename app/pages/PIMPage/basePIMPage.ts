import { Locator, Page, expect } from "@playwright/test";
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

  async extractEmpNumberFromUrl(url: string) {
    const match = url.match(/empNumber\/(\d+)/);
    expect(match).not.toBeNull();
    return match ? match[1] : "";
  }
}
