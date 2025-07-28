import { Locator, Page } from "@playwright/test";

export class ButtonComponent {
  private page: Page;

  readonly addButton: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
  }

  async clickButtonByText(buttonName: string) {
    return this.page.getByRole("button", { name: `${buttonName}` }).click();
  }
}
