import { Locator, expect } from "@playwright/test";
import { ComponentHolder } from "./abstractClasses";

export class AutocompleteComponent extends ComponentHolder {
  autocompleteInput(inputTitle: string): Locator {
    return this.page.locator(
      `.oxd-input-group:has(label:text-is("${inputTitle}")) .oxd-autocomplete-text-input input`
    );
  }

  option(optionText: string): Locator {
    return this.page.locator(
      `.oxd-autocomplete-dropdown [role="option"]:has-text("${optionText}")`
    );
  }

  async typeText(inputTitle: string, text: string) {
    await this.autocompleteInput(inputTitle).fill(text);
  }

  async selectOption(optionText: string) {
    const option = this.option(optionText);
    await expect(option).toBeVisible();
    await option.click();
  }

  async isOptionSelected(inputTitle: string, optionText: string) {
    await expect(this.autocompleteInput(inputTitle)).toHaveValue(optionText);
  }

  async fillAutocompleteField(inputTitle: string, text: string) {
    await this.typeText(inputTitle, text);
    await this.selectOption(text);
    await this.isOptionSelected(inputTitle, text);
  }
}
