import { expect, Locator, Page } from "@playwright/test";

export class DropdownComponent {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  showDropdownOptions(dropdownTitle: string): Locator {
    return this.page.locator(
      `.oxd-input-group:has(label:text-is("${dropdownTitle}")) .oxd-select-text-input`
    );
  }

  dropdownOption(option: string): Locator {
    return this.page.locator(
      `.oxd-select-dropdown [role="option"]:has-text("${option}")`
    );
  }

  selectedOption(option: string): Locator {
    return this.page.locator(`.oxd-select-text--active:has-text("${option}")`);
  }

  async selectDropdownOption(dropdown: string, option: string) {
    await this.showDropdownOptions(dropdown).click();
    await this.dropdownOption(option).click();
  }

  async isSelectedOptionVisible(option: string) {
    await expect(this.selectedOption(option)).toBeVisible();
  }
}
