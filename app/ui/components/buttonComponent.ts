import { Locator } from "@playwright/test";
import { ComponentHolder } from "./abstractClasses";

export class ButtonComponent extends ComponentHolder {
  readonly addButton: Locator;
  readonly searchButton: Locator;

  async clickButtonByText(buttonName: string) {
    return this.page.getByRole("button", { name: `${buttonName}` }).click();
  }
}
