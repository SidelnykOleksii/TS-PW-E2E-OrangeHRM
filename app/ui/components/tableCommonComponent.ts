import { Locator, Page, expect } from "@playwright/test";

export class CommonTableComponent {
  private page: Page;

  readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.confirmDeleteButton = this.page.getByRole("button", {
      name: " Yes, Delete",
    });
  }

  deleteButton(name: string): Locator {
    const partialName = name;
    return this.page
      .getByRole("row", { name: new RegExp(partialName, "i") })
      .locator("//button/i[@class='oxd-icon bi-trash']");
  }

  rowByName(name: string): Locator {
    return this.page.getByRole("row", { name: `${name}` });
  }

  async confirmDelete() {
    await this.confirmDeleteButton.click();
  }

  async isRowByNameVisible(name: string) {
    await expect(this.rowByName(name)).toBeVisible();
  }
}
